import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.NEW_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// TODO: Change back when ready
export const sql = neon(process.env.NEW_URL);
export const db = drizzle(sql);
