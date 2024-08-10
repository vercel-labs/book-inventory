import { fetchFilteredBooks } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

export async function BooksGrid({
  selectedAuthors,
  query,
  page,
}: {
  selectedAuthors: string[];
  query: string;
  page: number;
}) {
  const data = await fetchFilteredBooks(selectedAuthors, query, page);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {!data?.length ? (
        <p className="text-center text-muted-foreground col-span-full">
          No books found.
        </p>
      ) : (
        data.map((book) => (
          <Link
            href={`/${book.id}`}
            key={book.id}
            className="mb-auto transition ease-in-out rounded-lg hover:scale-105 bg-muted"
          >
            <div className="aspect-[2/3] overflow-hidden rounded-md">
              <Photo src={book.image!} title={book.title} />
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export function Photo({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative w-full h-full">
      {src ? (
        <Image
          id="img"
          alt={title}
          src={src}
          width={200}
          height={300}
          className="h-full w-full object-cover"
          style={{
            aspectRatio: '200/300',
            objectFit: 'cover',
          }}
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
