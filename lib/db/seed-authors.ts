import path from 'path';
import { sql } from './drizzle';
import { NeonQueryFunction } from '@neondatabase/serverless';
import { processEntities } from './seed-utils';

const BATCH_SIZE = 2000;
const CHECKPOINT_FILE = 'author_import_checkpoint.json';

// https://datarepo.eng.ucsd.edu/mcauley_group/gdrive/goodreads/goodreads_book_authors.json.gz
const TOTAL_AUTHORS = 4; // 829529 in full dataset, 4 in sample data

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

async function main() {
  try {
    const authorCount = await processEntities<AuthorData>(
      path.resolve('./lib/db/authors-full.json'),
      CHECKPOINT_FILE,
      BATCH_SIZE,
      batchInsertAuthors,
      sql,
      TOTAL_AUTHORS
    );
    console.log(
      `Seeded ${authorCount.toLocaleString()} / ${TOTAL_AUTHORS.toLocaleString()} authors`
    );
  } catch (error) {
    console.error('Error seeding authors:', error);
  }
}

main().catch(console.error);
