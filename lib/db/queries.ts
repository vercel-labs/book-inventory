import { cosineDistance, desc, eq, gt, sql } from 'drizzle-orm';
import { db } from './drizzle';
import { books, authors, bookToAuthor } from './schema';
import { generateEmbedding } from '../ai/embeddings';

const ITEMS_PER_PAGE = 30;

export async function fetchBooksWithPagination(searchParams: {
  q?: string;
  author?: string | string[];
  page?: string;
}) {
  let query = searchParams?.q || '';
  let requestedPage = Math.max(1, Number(searchParams?.page) || 1);

  let selectedAuthors = !searchParams.author
    ? []
    : Array.isArray(searchParams.author)
      ? searchParams.author.map((author) => decodeURIComponent(author.trim()))
      : searchParams.author
          .split(',')
          .map((author) => decodeURIComponent(author.trim()));

  let whereClause = sql`TRUE`;
  let orderClause = desc(books.createdAt);
  let similarityClause = sql`1`;

  if (query) {
    const queryEmbedding = await generateEmbedding(query);
    similarityClause = sql<number>`1 - (${cosineDistance(books.embedding, queryEmbedding)})`;
    whereClause = sql`${books.embedding} IS NOT NULL AND ${gt(similarityClause, 0.2)}`;
    orderClause = desc(similarityClause);
  }

  if (selectedAuthors.length > 0) {
    whereClause = sql`${whereClause} AND ${books.id} IN (
      SELECT ${bookToAuthor.bookId}
      FROM ${bookToAuthor}
      JOIN ${authors} ON ${bookToAuthor.authorId} = ${authors.id}
      WHERE ${authors.name} IN (${selectedAuthors})
    )`;
  }

  let countResult = await db
    .select({ total: sql<number>`count(DISTINCT ${books.id})` })
    .from(books)
    .leftJoin(bookToAuthor, eq(books.id, bookToAuthor.bookId))
    .leftJoin(authors, eq(bookToAuthor.authorId, authors.id))
    .where(whereClause);

  let totalItems = Number(countResult[0].total);
  let totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  let currentPage = Math.min(requestedPage, totalPages);
  let offset = (currentPage - 1) * ITEMS_PER_PAGE;

  let paginatedBooks = await db
    .select({
      id: books.id,
      isbn: books.isbn,
      isbn13: books.isbn13,
      title: books.title,
      publication_year: books.publication_year,
      publisher: books.publisher,
      image_url: books.image_url,
      description: books.description,
      num_pages: books.num_pages,
      language_code: books.language_code,
      text_reviews_count: books.text_reviews_count,
      ratings_count: books.ratings_count,
      average_rating: books.average_rating,
      series: books.series,
      popular_shelves: books.popular_shelves,
      metadata: books.metadata,
      createdAt: books.createdAt,
      authors: sql<string[]>`array_agg(DISTINCT ${authors.name})`,
      similarity: similarityClause,
    })
    .from(books)
    .leftJoin(bookToAuthor, eq(books.id, bookToAuthor.bookId))
    .leftJoin(authors, eq(bookToAuthor.authorId, authors.id))
    .where(whereClause)
    .groupBy(books.id)
    .orderBy(orderClause)
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
    .select({
      id: books.id,
      isbn: books.isbn,
      isbn13: books.isbn13,
      title: books.title,
      publication_year: books.publication_year,
      publisher: books.publisher,
      image_url: books.image_url,
      description: books.description,
      num_pages: books.num_pages,
      language_code: books.language_code,
      text_reviews_count: books.text_reviews_count,
      ratings_count: books.ratings_count,
      average_rating: books.average_rating,
      series: books.series,
      popular_shelves: books.popular_shelves,
      createdAt: books.createdAt,
      authors: sql<string[]>`array_agg(${authors.name})`,
    })
    .from(books)
    .leftJoin(bookToAuthor, eq(books.id, bookToAuthor.bookId))
    .leftJoin(authors, eq(bookToAuthor.authorId, authors.id))
    .where(eq(books.id, parseInt(id)))
    .groupBy(books.id)
    .limit(1);

  return result[0];
}

export async function fetchAuthors() {
  let result = await db
    .select({
      id: authors.id,
      name: authors.name,
    })
    .from(authors)
    .orderBy(authors.name);

  if (result.length == 0) {
    throw new Error('Database setup incomplete');
  }

  return result;
}
