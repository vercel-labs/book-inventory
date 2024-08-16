import Link from 'next/link';
import { SelectBook } from '@/lib/db/schema';
import { Photo } from './photo';

export async function BooksGrid({ books }: { books: SelectBook[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {!books?.length ? (
        <p className="text-center text-muted-foreground col-span-full">
          No books found.
        </p>
      ) : (
        books.map((book, index) => (
          <Link
            href={`/${book.id}`}
            key={book.id}
            className="block transition ease-in-out md:hover:scale-105"
          >
            <Photo
              src={book.image_url!}
              title={book.title}
              priority={index < 4}
            />
          </Link>
        ))
      )}
    </div>
  );
}
