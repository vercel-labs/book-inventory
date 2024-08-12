import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

const postgres = neon(process.env.POSTGRES_URL!);
export const db = drizzle(postgres);

export const books = pgTable(
  'books',
  {
    id: serial('id').primaryKey(),
    isbn: text('isbn').notNull(),
    title: text('title').notNull(),
    author: text('author').notNull(),
    year: integer('year').notNull(),
    publisher: text('publisher').notNull(),
    image: text('image'),
    description: text('description'),
    rating: integer('rating'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (table) => {
    return {
      searchIdx: index('idx_books_search_trigram').using(
        'gin',
        sql`(${table.isbn} gin_trgm_ops, ${table.title} gin_trgm_ops, ${table.author} gin_trgm_ops, ${table.publisher} gin_trgm_ops)`
      ),
      authorIdx: index('idx_books_author').on(table.author),
      createdAtIdx: index('idx_books_created_at').on(table.createdAt),
    };
  }
);
