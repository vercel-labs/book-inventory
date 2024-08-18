import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { sql } from './drizzle';
import { NeonQueryFunction } from '@neondatabase/serverless';

const BATCH_SIZE = 900;
const CHECKPOINT_FILE = 'book_import_checkpoint.json';

interface BookData {
  isbn: string | null;
  isbn13: string | null;
  title: string;
  authors: { author_id: string }[];
  publication_year: string | null;
  publisher: string | null;
  image_url: string | null;
  description: string | null;
  num_pages: string | null;
  language_code: string | null;
  text_reviews_count: string | null;
  ratings_count: string | null;
  average_rating: string | null;
  series: string[] | null;
  popular_shelves: { count: string; name: string }[];
}

async function batchInsertBooks(
  batch: BookData[],
  sqlQuery: NeonQueryFunction<false, false>
) {
  const insertBookAndAuthorsQuery = `
    WITH inserted_book AS (
      INSERT INTO books (isbn, isbn13, title, publication_year, publisher, image_url, description, num_pages, language_code, text_reviews_count, ratings_count, average_rating, series, popular_shelves)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (isbn) DO NOTHING
      RETURNING id
    )
    INSERT INTO book_to_author (book_id, author_id)
    SELECT inserted_book.id, unnest($15::text[])
    FROM inserted_book
    WHERE inserted_book.id IS NOT NULL
    ON CONFLICT DO NOTHING
  `;

  return sqlQuery.transaction((tx) => {
    return batch.map((book) =>
      tx(insertBookAndAuthorsQuery, [
        book.isbn || null,
        book.isbn13 || null,
        book.title,
        book.publication_year ? parseInt(book.publication_year) : null,
        book.publisher || null,
        book.image_url || null,
        book.description || null,
        book.num_pages ? parseInt(book.num_pages) : null,
        book.language_code || null,
        book.text_reviews_count ? parseInt(book.text_reviews_count) : null,
        book.ratings_count ? parseInt(book.ratings_count) : null,
        book.average_rating ? parseFloat(book.average_rating) : null,
        book.series || null,
        JSON.stringify(book.popular_shelves),
        book.authors.map((author) => author.author_id),
      ])
    );
  });
}

async function saveCheckpoint(processedLines: number) {
  await fs.promises.writeFile(
    CHECKPOINT_FILE,
    JSON.stringify({ processedLines }),
    'utf8'
  );
}

async function loadCheckpoint(): Promise<number> {
  try {
    const data = await fs.promises.readFile(CHECKPOINT_FILE, 'utf8');
    return JSON.parse(data).processedLines;
  } catch (error) {
    return 0;
  }
}

async function processBooks(filePath: string): Promise<number> {
  const startLine = await loadCheckpoint();
  let processedLines = startLine;
  let batch: BookData[] = [];
  const startTime = Date.now();

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (processedLines < startLine) {
      processedLines++;
      continue;
    }

    try {
      const book = JSON.parse(line) as BookData;
      batch.push(book);
      processedLines++;

      if (batch.length >= BATCH_SIZE) {
        const batchStartTime = Date.now();
        await batchInsertBooks(batch, sql);
        const batchEndTime = Date.now();
        batch = [];
        await saveCheckpoint(processedLines);
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const batchSeconds = (batchEndTime - batchStartTime) / 1000;
        const estimatedTotalSeconds =
          (elapsedSeconds / processedLines) * 2000000; // Assuming 2 million books
        console.log(
          `Processed ${processedLines} books. Batch took ${batchSeconds.toFixed(2)}s. Estimated total time: ${(estimatedTotalSeconds / 60).toFixed(2)} minutes`
        );
      }
    } catch (error) {
      console.error('Error processing line:', error);
    }
  }

  if (batch.length > 0) {
    await batchInsertBooks(batch, sql);
    await saveCheckpoint(processedLines);
  }

  const totalSeconds = (Date.now() - startTime) / 1000;
  console.log(
    `Total processing time: ${(totalSeconds / 60).toFixed(2)} minutes`
  );

  return processedLines;
}

async function main() {
  try {
    const bookCount = await processBooks(
      path.resolve('./lib/db/books-full.json')
    );
    console.log(`Seeded ${bookCount} books`);
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main().catch(console.error);
