import { sql } from "@vercel/postgres";

const ITEMS_PER_PAGE = 30;

function isTableMissing(error: any) {
  // PostgreSQL error code for "undefined table"
  return error.code === "42P01";
}

function handleDatabaseError(error: any, returnVal: number | never[]) {
  if (isTableMissing(error)) {
    console.error("Database Error - Table missing:", error);
    return returnVal;
  } else {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books.");
  }
}

export async function fetchFilteredBooks(
  selectedAuthors: string[],
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  if (selectedAuthors.length > 0) {
    try {
      const authorsDelimited = selectedAuthors.join("|");

      const books = await sql`
                SELECT ALL
                    id,
                    isbn,
                    "title",
                    "author",
                    "year",
                    publisher,
                    image,
                    "description",
                    "rating",
                    "createdAt"
                FROM books
                WHERE
                    "author" = ANY(STRING_TO_ARRAY(${authorsDelimited}, '|')) AND (
                        isbn ILIKE ${`%${query}%`} OR
                        "title" ILIKE ${`%${query}%`} OR
                        "author" ILIKE ${`%${query}%`} OR
                        "year"::text ILIKE ${`%${query}%`} OR
                        publisher ILIKE ${`%${query}%`}
                    )
                ORDER BY "createdAt" DESC
                LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
            `;
      return books.rows;
    } catch (error) {
      return handleDatabaseError(error, []);
    }
  }

  try {
    const books = await sql`
            SELECT ALL
                id,
                isbn,
                "title",
                "author",
                "year",
                publisher,
                "image",
                "description",
                "rating",
                "createdAt"
            FROM books
            WHERE
                isbn ILIKE ${`%${query}%`} OR
                "title" ILIKE ${`%${query}%`} OR
                "author" ILIKE ${`%${query}%`} OR
                "year"::text ILIKE ${`%${query}%`} OR
                publisher ILIKE ${`%${query}%`}
            ORDER BY "createdAt" DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `;
    return books.rows;
  } catch (error) {
    return handleDatabaseError(error, []);
  }
}

export async function fetchBookById(id: string) {
  const data = await sql`SELECT * FROM books WHERE id = ${id}`;
  return data.rows[0];
}

export async function fetchAuthors() {
  try {
    const authors = await sql`
		        SELECT DISTINCT "author"
		        FROM books
		        ORDER BY "author"
		    `;
    return authors.rows?.map((row) => row.author);
  } catch (error) {
    return handleDatabaseError(error, []);
  }
}

export async function fetchPages(query: string, selectedAuthors: string[]) {
  if (selectedAuthors.length > 0) {
    try {
      const authorsDelimited = selectedAuthors.join("|");

      const count = await sql`
      SELECT COUNT(*)
        FROM books
        WHERE
            "author" = ANY(STRING_TO_ARRAY(${authorsDelimited}, '|')) AND (
                isbn ILIKE ${`%${query}%`} OR
                "title" ILIKE ${`%${query}%`} OR
                "author" ILIKE ${`%${query}%`} OR
                "year"::text ILIKE ${`%${query}%`} OR
                publisher ILIKE ${`%${query}%`}
            )
            `;
      const totalPages = Math.ceil(
        Number(count.rows[0].count) / ITEMS_PER_PAGE,
      );
      return totalPages;
    } catch (error) {
      return handleDatabaseError(error, 0);
    }
  }

  try {
    const count = await sql`
    SELECT COUNT(*)
        FROM books
        WHERE
            isbn ILIKE ${`%${query}%`} OR
            "title" ILIKE ${`%${query}%`} OR
            "author" ILIKE ${`%${query}%`} OR
            "year"::text ILIKE ${`%${query}%`} OR
            publisher ILIKE ${`%${query}%`}
        `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    return handleDatabaseError(error, 0);
  }
}
