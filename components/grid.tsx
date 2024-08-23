import Link from 'next/link';
import { Book } from '@/lib/db/schema';
import { Photo } from './photo';
import { SearchParams, stringifySearchParams } from '@/lib/url-state';

export async function BooksGrid({
  books,
  searchParams,
}: {
  books: Book[];
  searchParams: SearchParams;
}) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {!books?.length ? (
        <p className="text-center text-muted-foreground col-span-full">
          No books found.
        </p>
      ) : (
        books.map((book, index) => (
          <BookLink
            key={book.id}
            priority={index < 10}
            book={book}
            searchParams={searchParams}
          />
        ))
      )}
    </div>
  );
}

function BookLink({
  priority,
  book,
  searchParams,
}: {
  priority: boolean;
  book: Book;
  searchParams: SearchParams;
}) {
  if (!book.thumbhash) {
    console.warn(`Book ${book.id} has no thumbhash`);
    return null;
  }

  let noFilters = Object.values(searchParams).every((v) => v === undefined);

  return (
    <Link
      href={`/${book.id}?${stringifySearchParams(searchParams)}`}
      key={book.id}
      className="block transition ease-in-out md:hover:scale-105"
      prefetch={noFilters ? true : null}
    >
      <Photo
        src={book.image_url!}
        title={book.title}
        thumbhash={book.thumbhash!}
        priority={priority}
      />
    </Link>
  );
}
