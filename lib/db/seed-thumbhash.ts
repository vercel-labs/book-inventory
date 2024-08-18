import path from 'path';
import { sql } from './drizzle';
import { NeonQueryFunction } from '@neondatabase/serverless';
import { processEntities } from './seed-utils';
import sharp from 'sharp';
import * as ThumbHash from 'thumbhash';
import { EMPTY_IMAGE_URL } from './queries';
import pLimit from 'p-limit';

const BATCH_SIZE = 900;
const CHECKPOINT_FILE = 'thumbhash_update_checkpoint.json';
const TOTAL_BOOKS = 2360655;
const CONCURRENCY_LIMIT = 10;

interface BookData {
  image_url: string | null;
}

const limit = pLimit(CONCURRENCY_LIMIT);

async function fetchImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Failed to fetch image: ${url} - Status: ${response.status}`
      );
      return null;
    }
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    console.error(`Error fetching image: ${url}`, error);
    return null;
  }
}

async function generateThumbHash(imageBuffer: Buffer): Promise<string | null> {
  try {
    const { data, info } = await sharp(imageBuffer)
      .resize(100, 100, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const binaryThumbHash = ThumbHash.rgbaToThumbHash(
      info.width,
      info.height,
      data
    );
    return Buffer.from(binaryThumbHash).toString('base64');
  } catch (error) {
    console.error('Error generating thumbhash:', error);
    return null;
  }
}

async function processBook(book: BookData): Promise<[string, string] | null> {
  if (book.image_url && book.image_url !== EMPTY_IMAGE_URL) {
    const imageBuffer = await fetchImage(book.image_url);
    if (imageBuffer) {
      const thumbHash = await generateThumbHash(imageBuffer);
      if (thumbHash) {
        return [thumbHash, book.image_url];
      }
    }
  }
  return null;
}

async function batchUpdateThumbHash(
  batch: BookData[],
  sqlQuery: NeonQueryFunction<false, false>
) {
  const updateThumbhashQuery = `
    UPDATE books
    SET thumbhash = $1
    WHERE image_url = $2
  `;

  const processedBooks = await Promise.all(
    batch.map((book) => limit(() => processBook(book)))
  );

  const queries = processedBooks
    .filter((result): result is [string, string] => result !== null)
    .map(([thumbHash, imageUrl]) =>
      sqlQuery(updateThumbhashQuery, [thumbHash, imageUrl])
    );

  return sqlQuery.transaction((tx) => queries);
}

async function main() {
  try {
    const bookCount = await processEntities<BookData>(
      path.resolve('./lib/db/books-full.json'),
      CHECKPOINT_FILE,
      BATCH_SIZE,
      batchUpdateThumbHash,
      sql,
      TOTAL_BOOKS
    );
    console.log(
      `Updated thumbhash for ${bookCount.toLocaleString()} / ${TOTAL_BOOKS.toLocaleString()} books`
    );
  } catch (error) {
    console.error('Error updating thumbhash:', error);
  }
}

main().catch(console.error);
