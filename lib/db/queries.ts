import { sql, and, gte, eq, lte, not, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { books, authors, bookToAuthor } from './schema';
import { SearchParams } from '@/lib/url-state';

export const ITEMS_PER_PAGE = 28;
export const EMPTY_IMAGE_URL =
  'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';

const yearFilter = (yr?: string) => {
  if (yr) {
    const maxYear = Math.max(1950, Math.min(2023, Number(yr)));
    return and(
      gte(books.publication_year, 1950),
      lte(books.publication_year, maxYear)
    );
  }
  return and(
    gte(books.publication_year, 1950),
    lte(books.publication_year, 2023)
  );
};

const ratingFilter = (rtg?: string) => {
  if (rtg) {
    const minRating = Number(rtg);
    return sql`${books.average_rating} >= ${minRating}`;
  }
  return undefined;
};

const languageFilter = (lng?: string) => {
  if (lng === 'en') {
    return sql`${books.language_code} IN ('eng', 'en-US', 'en-GB')`;
  }
  return lng ? eq(books.language_code, lng) : undefined;
};

const pageFilter = (pgs?: string) => {
  if (pgs) {
    const maxPages = Math.min(1000, Number(pgs));
    return lte(books.num_pages, maxPages);
  }
  return lte(books.num_pages, 1000);
};

const searchFilter = (q?: string) => {
  if (q) {
    const tsQuery = q.trim().split(/\s+/).join(' & ');
    return sql`${books.title_tsv} @@ to_tsquery('english', ${tsQuery})`;
  }
  return undefined;
};

const imageFilter = () => {
  return and(
    not(isNull(books.image_url)),
    sql`${books.image_url} != ${EMPTY_IMAGE_URL}`
  );
};

const isbnFilter = (isbn?: string) => {
  if (isbn) {
    const isbnArray = isbn.split(',').map((id) => id.trim());
    return sql`books.isbn IN (${sql.join(
      isbnArray.map((id) => sql`${id}`),
      sql`, `
    )})`;
  }
  return undefined;
};

export async function fetchBooksWithPagination(searchParams: SearchParams) {
  let requestedPage = Math.max(1, Number(searchParams?.page) || 1);

  const filters = [
    yearFilter(searchParams.yr),
    ratingFilter(searchParams.rtg),
    languageFilter(searchParams.lng),
    pageFilter(searchParams.pgs),
    imageFilter(),
    searchFilter(searchParams.search),
    isbnFilter(searchParams.isbn),
  ].filter(Boolean);

  const whereClause = filters.length > 0 ? and(...filters) : undefined;
  const offset = (requestedPage - 1) * ITEMS_PER_PAGE;

  const paginatedBooks = await db
    .select({
      id: books.id,
      title: books.title,
      image_url: books.image_url,
      thumbhash: books.thumbhash,
    })
    .from(books)
    .where(whereClause)
    .orderBy(books.id)
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  return paginatedBooks;
}

export async function estimateTotalBooks(searchParams: SearchParams) {
  const filters = [
    yearFilter(searchParams.yr),
    ratingFilter(searchParams.rtg),
    languageFilter(searchParams.lng),
    pageFilter(searchParams.pgs),
    imageFilter(),
    searchFilter(searchParams.search),
    isbnFilter(searchParams.isbn),
  ].filter(Boolean);

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  // Use explain to get an estimate
  const explainResult = await db.execute(sql`
    EXPLAIN (FORMAT JSON)
    SELECT id FROM books
    ${whereClause ? sql`WHERE ${whereClause}` : sql``}
  `);

  const planRows = (explainResult.rows[0] as any)['QUERY PLAN'][0]['Plan'][
    'Plan Rows'
  ];
  return planRows;
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
      thumbhash: books.thumbhash,
    })
    .from(books)
    .leftJoin(bookToAuthor, eq(books.id, bookToAuthor.bookId))
    .leftJoin(authors, eq(bookToAuthor.authorId, authors.id))
    .where(eq(books.id, parseInt(id)))
    .groupBy(books.id)
    .limit(1);

  return result[0];
}
