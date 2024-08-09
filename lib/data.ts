import { eq, ilike, or, sql, desc, count } from 'drizzle-orm';
import { books, db } from './db';

const ITEMS_PER_PAGE = 30;

export async function fetchFilteredBooks(
  selectedAuthors: string[],
  query: string,
  currentPage: number
) {
  let offset = (currentPage - 1) * ITEMS_PER_PAGE;

  let baseQuery = db
    .select()
    .from(books)
    .where(
      or(
        ilike(books.isbn, `%${query}%`),
        ilike(books.title, `%${query}%`),
        ilike(books.author, `%${query}%`),
        ilike(books.publisher, `%${query}%`),
        sql`${books.year}::text ILIKE ${`%${query}%`}`
      )
    )
    .orderBy(desc(books.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset)
    .$dynamic();

  if (selectedAuthors.length > 0) {
    const authorsDelimited = selectedAuthors.join('|');

    baseQuery = baseQuery.where(
      sql`${books.author} = ANY(STRING_TO_ARRAY(${authorsDelimited}, '|'))`
    );
  }

  return await baseQuery;
}

export async function fetchBookById(id: string) {
  let result = await db
    .select()
    .from(books)
    .where(eq(books.id, parseInt(id)))
    .limit(1);

  return result[0];
}

export async function fetchAuthors() {
  let result = await db
    .select({ author: books.author })
    .from(books)
    .groupBy(books.author)
    .orderBy(books.author);

  if (result.length == 0) {
    throw new Error('Database setup incomplete');
  }

  return result.map((row) => row.author);
}

export async function fetchPages(query: string, selectedAuthors: string[]) {
  let baseQuery = db
    .select({ count: count() })
    .from(books)
    .where(
      or(
        ilike(books.isbn, `%${query}%`),
        ilike(books.title, `%${query}%`),
        ilike(books.author, `%${query}%`),
        ilike(books.publisher, `%${query}%`),
        sql`${books.year}::text ILIKE ${`%${query}%`}`
      )
    )
    .$dynamic();

  if (selectedAuthors.length > 0) {
    const authorsDelimited = selectedAuthors.join('|');

    baseQuery = baseQuery.where(
      sql`${books.author} = ANY(STRING_TO_ARRAY(${authorsDelimited}, '|'))`
    );
  }

  let result = await baseQuery;
  let totalPages = Math.ceil(result[0].count / ITEMS_PER_PAGE);
  return totalPages;
}
