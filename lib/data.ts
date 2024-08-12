import { eq, sql, desc, count } from 'drizzle-orm';
import { books, db } from './db';

const ITEMS_PER_PAGE = 30;

export async function fetchBooksWithPagination(searchParams: {
  q?: string;
  author?: string | string[];
  page?: string;
}) {
  let query = searchParams?.q || '';
  let currentPage = Math.max(1, Number(searchParams?.page) || 1);

  let selectedAuthors = !searchParams.author
    ? []
    : Array.isArray(searchParams.author)
      ? searchParams.author.map((author) => decodeURIComponent(author.trim()))
      : searchParams.author
          .split(',')
          .map((author) => decodeURIComponent(author.trim()));

  let whereClause = sql`TRUE`;
  if (query) {
    whereClause = sql`(
      ${books.isbn} % ${query} OR
      ${books.title} % ${query} OR
      ${books.publisher} % ${query}
    )`;
  }

  if (selectedAuthors.length > 0) {
    let authorConditions = selectedAuthors.map(
      (author) => sql`${books.author} ILIKE ${`%${author}%`}`
    );
    whereClause = sql`${whereClause} AND (${sql.join(authorConditions, sql` OR `)})`;
  }

  let countResult = await db
    .select({ total: count() })
    .from(books)
    .where(whereClause);

  let totalItems = Number(countResult[0].total);
  let totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  currentPage = Math.min(currentPage, totalPages);
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
