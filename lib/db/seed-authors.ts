import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { sql } from './drizzle';
import { NeonQueryFunction } from '@neondatabase/serverless';

const BATCH_SIZE = 2000;
const CHECKPOINT_FILE = 'author_import_checkpoint.json';

interface AuthorData {
  average_rating: string;
  author_id: string;
  text_reviews_count: string;
  name: string;
  ratings_count: string;
}

async function batchInsertAuthors(
  batch: AuthorData[],
  sqlQuery: NeonQueryFunction<false, false>
) {
  const insertQuery = `
    INSERT INTO authors (id, name, average_rating, text_reviews_count, ratings_count)
    VALUES ($1, $2, $3::numeric, $4::integer, $5::integer)
    ON CONFLICT (id) DO NOTHING
  `;

  const queries = batch.map((author) =>
    sqlQuery(insertQuery, [
      author.author_id,
      author.name,
      author.average_rating,
      author.text_reviews_count,
      author.ratings_count,
    ])
  );

  await sql.transaction(queries);
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

async function processAuthors(filePath: string): Promise<number> {
  const startLine = await loadCheckpoint();
  let processedLines = startLine;
  let batch: AuthorData[] = [];

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
      const author = JSON.parse(line) as AuthorData;
      batch.push(author);
      processedLines++;

      if (batch.length >= BATCH_SIZE) {
        await batchInsertAuthors(batch, sql);
        batch = [];
        await saveCheckpoint(processedLines);
        console.log(`Processed ${processedLines} authors`);
      }
    } catch (error) {
      console.error('Error processing line:', error);
    }
  }

  if (batch.length > 0) {
    await batchInsertAuthors(batch, sql);
    await saveCheckpoint(processedLines);
  }

  return processedLines;
}

async function main() {
  try {
    const authorCount = await processAuthors(
      path.resolve('./lib/db/authors-full.json')
    );
    console.log(`Seeded ${authorCount} authors`);
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main().catch(console.error);
