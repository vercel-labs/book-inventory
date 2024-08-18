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
        books.map((book) => (
          <Link
            href={`/${book.id}?${stringifySearchParams(searchParams)}`}
            key={book.id}
            className="block transition ease-in-out md:hover:scale-105"
          >
            <Photo
              src={book.image_url!}
              title={book.title}
              thumbhash={book.thumbhash!}
            />
          </Link>
        ))
      )}
    </div>
  );
}
