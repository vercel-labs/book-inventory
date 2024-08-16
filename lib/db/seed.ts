import fs from 'fs';
import path from 'path';
import readline from 'readline';
import dotenv from 'dotenv';
import { db } from './drizzle';
import { books, authors, bookToAuthor } from './schema';

dotenv.config();

interface Author {
  author_id: string;
  role: string;
}

interface PopularShelf {
  count: string;
  name: string;
}

interface BookData {
  isbn: string;
  isbn13: string;
  title: string;
  authors: Author[];
  publication_year: string;
  publisher: string;
  image_url: string;
  description: string;
  num_pages: string;
  language_code: string;
  text_reviews_count: string;
  ratings_count: string;
  average_rating: string;
  series: string[];
  popular_shelves: PopularShelf[];
}

interface AuthorData {
  average_rating: string;
  author_id: string;
  text_reviews_count: string;
  name: string;
  ratings_count: string;
}

const BATCH_SIZE = 1000;

async function processFile<T>(
  filePath: string,
  processor: (batch: T[]) => Promise<void>
): Promise<number> {
  return new Promise((resolve, reject) => {
    let count = 0;
    let batch: T[] = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    rl.on('line', async (line) => {
      try {
        const data = JSON.parse(line) as T;
        batch.push(data);
        count++;

        if (batch.length >= BATCH_SIZE) {
          rl.pause();
          await processor(batch);
          batch = [];
          rl.resume();
        }

        if (count % BATCH_SIZE === 0) {
          console.log(`Processed ${count} records`);
        }
      } catch (error) {
        console.error('Error processing line:', error);
      }
    });

    rl.on('close', async () => {
      if (batch.length > 0) {
        await processor(batch);
      }
      console.log(`Finished processing ${count} records`);
      resolve(count);
    });
  });
}

async function processAuthors(authorBatch: AuthorData[]) {
  await db
    .insert(authors)
    .values(
      authorBatch.map((author) => ({
        id: author.author_id,
        name: author.name,
        average_rating: author.average_rating,
        text_reviews_count: parseInt(author.text_reviews_count),
        ratings_count: parseInt(author.ratings_count),
      }))
    )
    .onConflictDoNothing();
}

async function processBooks(bookBatch: BookData[]) {
  const bookInserts = await db
    .insert(books)
    .values(
      bookBatch.map((book) => ({
        isbn: book.isbn || null,
        isbn13: book.isbn13 || null,
        title: book.title,
        publication_year: book.publication_year
          ? parseInt(book.publication_year)
          : null,
        publisher: book.publisher || null,
        image_url: book.image_url || null,
        description: book.description || null,
        num_pages: book.num_pages ? parseInt(book.num_pages) : null,
        language_code: book.language_code || null,
        text_reviews_count: book.text_reviews_count
          ? parseInt(book.text_reviews_count)
          : null,
        ratings_count: book.ratings_count ? parseInt(book.ratings_count) : null,
        average_rating: book.average_rating ? book.average_rating : null,
        series: book.series || [],
        popular_shelves: book.popular_shelves,
      }))
    )
    .returning({ insertedId: books.id });

  const bookAuthorValues = bookInserts.flatMap((bookInsert, index) =>
    bookBatch[index].authors.map((author) => ({
      bookId: bookInsert.insertedId,
      authorId: author.author_id,
    }))
  );

  await db.insert(bookToAuthor).values(bookAuthorValues).onConflictDoNothing();
}

async function main() {
  const authorCount = await processFile<AuthorData>(
    path.resolve('./lib/db/authors.json'),
    processAuthors
  );
  console.log(`Seeded ${authorCount} authors`);

  const bookCount = await processFile<BookData>(
    path.resolve('./lib/db/books.json'),
    processBooks
  );
  console.log(`Seeded ${bookCount} books`);

  return {
    seededAuthors: authorCount,
    seededBooks: bookCount,
  };
}

main().catch(console.error);
