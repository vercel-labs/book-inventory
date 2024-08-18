import path from 'path';
import { sql } from './drizzle';
import { NeonQueryFunction } from '@neondatabase/serverless';
import { processEntities } from './seed-utils';

const BATCH_SIZE = 900;
const CHECKPOINT_FILE = 'book_import_checkpoint.json';

// https://datarepo.eng.ucsd.edu/mcauley_group/gdrive/goodreads/goodreads_books.json.gz
const TOTAL_BOOKS = 4; // 2360655 in full dataset, 4 in sample data

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
        book.average_rating ? book.average_rating : null,
        book.series || null,
        JSON.stringify(book.popular_shelves),
        book.authors.map((author) => author.author_id),
      ])
    );
  });
}

async function main() {
  try {
    const bookCount = await processEntities<BookData>(
      path.resolve('./lib/db/books-full.json'),
      CHECKPOINT_FILE,
      BATCH_SIZE,
      batchInsertBooks,
      sql,
      TOTAL_BOOKS
    );
    console.log(
      `Seeded ${bookCount.toLocaleString()} / ${TOTAL_BOOKS.toLocaleString()} books`
    );
  } catch (error) {
    console.error('Error seeding books:', error);
  }
}

main().catch(console.error);
