import { sql, and, between, eq, desc, count } from 'drizzle-orm';
import { db } from './drizzle';
import { books, authors, bookToAuthor } from './schema';

const ITEMS_PER_PAGE = 28;

const yearRangeFilter = (yr?: string[]) => {
  if (yr && yr.length === 2) {
    const [startYear, endYear] = yr.map(Number);
    return between(books.publication_year, startYear, endYear);
  }
  return undefined;
};

const ratingFilter = (rtg?: string) => {
  if (rtg) {
    const minRating = Number(rtg);
    return sql`${books.average_rating} >= ${minRating}`;
  }
  return undefined;
};

const languageFilter = (lng?: string) => {
  return lng ? eq(books.language_code, lng) : undefined;
};

const pageRangeFilter = (pgs?: string[]) => {
  if (pgs && pgs.length === 2) {
    const [minPages, maxPages] = pgs.map(Number);
    return between(books.num_pages, minPages, maxPages);
  }
  return undefined;
};

const searchFilter = (q?: string) => {
  if (q) {
    const tsQuery = q.trim().split(/\s+/).join(' & ');
    return sql`${books.title_tsv} @@ to_tsquery('english', ${tsQuery})`;
  }
  return undefined;
};

export async function fetchBooksWithPagination(searchParams: {
  search?: string;
  yr?: string[];
  rtg?: string;
  lng?: string;
  pgs?: string[];
  page?: string;
}) {
  let requestedPage = Math.max(1, Number(searchParams?.page) || 1);

  const filters = [
    yearRangeFilter(searchParams.yr),
    ratingFilter(searchParams.rtg),
    languageFilter(searchParams.lng),
    pageRangeFilter(searchParams.pgs),
    searchFilter(searchParams.search),
  ].filter(Boolean);

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  // let countResult = await db
  //   .select({ total: count() })
  //   .from(books)
  //   .where(whereClause)
  //   .limit(ITEMS_PER_PAGE * 100);

  let totalItems = 1000;
  // let totalItems = Number(countResult[0].total);
  let totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  let currentPage = Math.min(requestedPage, totalPages);
  let offset = (currentPage - 1) * ITEMS_PER_PAGE;

  console.log('fetchBooksWithPagination');

  let paginatedBooks = await db
    .select({
      id: books.id,
      title: books.title,
      image_url: books.image_url,
    })
    .from(books)
    // .where(whereClause)
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
