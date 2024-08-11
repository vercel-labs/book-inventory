import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { books } from '@/lib/db';

type SelectBook = typeof books.$inferSelect;

export async function BooksGrid({ books }: { books: SelectBook[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {!books?.length ? (
        <p className="text-center text-muted-foreground col-span-full">
          No books found.
        </p>
      ) : (
        books.map((book) => (
          <Link
            href={`/${book.id}`}
            key={book.id}
            className="block transition ease-in-out md:hover:scale-105"
          >
            <Photo src={book.image!} title={book.title} />
          </Link>
        ))
      )}
    </div>
  );
}

export function Photo({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted">
      {src ? (
        <Image
          alt={title}
          src={src}
          fill
          sizes="(min-width: 1280px) 16.67vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33.33vw, 50vw"
          className="object-cover"
          priority
        />
      ) : (
        <EmptyTile />
      )}
    </div>
  );
}

function EmptyTile() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <ImageIcon className="w-10 opacity-30" />
      <p className="text-xs opacity-30">No image available</p>
    </div>
  );
}
