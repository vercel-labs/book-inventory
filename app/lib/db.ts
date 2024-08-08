import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

const sql = neon(process.env.POSTGRES_URL!);
export const db = drizzle(sql);

export const books = pgTable('books', {
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
});
