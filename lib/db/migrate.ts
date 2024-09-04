import dotenv from 'dotenv';
import path from 'path';
import { migrate } from 'drizzle-orm/neon-http/migrator';

dotenv.config();

import { db } from './drizzle';

async function main() {
  await migrate(db, { migrationsFolder: path.join(__dirname, './migrations') });
  console.log(`Migrations complete`);
}

main();
