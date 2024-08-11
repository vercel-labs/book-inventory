import { eq, ilike, or, and, sql, desc, count } from 'drizzle-orm';
import { books, db } from './db';

const ITEMS_PER_PAGE = 30;

export async function fetchBooksWithPagination(searchParams: {
  q?: string;
  author?: string | string[];
  page?: string;
}) {
  let query = searchParams?.q || '';
  let currentPage = Number(searchParams?.page) || 1;
  if (currentPage < 1) {
    currentPage = 1;
  }

  // Parse the author parameter
  let selectedAuthors = !searchParams.author
    ? []
    : typeof searchParams.author === 'string'
      ? searchParams.author
          .split(',')
          .map((author) => decodeURIComponent(author.trim()))
      : searchParams.author.map((author) => decodeURIComponent(author.trim()));

  let whereClause = or(
    ilike(books.isbn, `%${query}%`),
    ilike(books.title, `%${query}%`),
    ilike(books.publisher, `%${query}%`),
    sql`${books.year}::text ILIKE ${`%${query}%`}`
  );

  if (selectedAuthors.length > 0) {
    let authorConditions = selectedAuthors.map((author) =>
      ilike(books.author, `%${author}%`)
    );
    whereClause = and(whereClause, or(...authorConditions));
  }

  let countResult = await db
    .select({ total: count() })
    .from(books)
    .where(whereClause);

  let totalItems = Number(countResult[0].total);
  let totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  currentPage = Math.max(1, Math.min(currentPage, totalPages));
  let offset = (currentPage - 1) * ITEMS_PER_PAGE;

  let paginatedBooks = await db
    .select()
    .from(books)
    .where(whereClause)
    .orderBy(desc(books.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  return {
    books: paginatedBooks,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
    },
  };
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
