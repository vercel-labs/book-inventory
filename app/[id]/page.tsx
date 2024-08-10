import Link from 'next/link';
import { fetchBookById } from '@/lib/data';
import { Photo } from '@/components/grid';
import { Star } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return null;

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-6 h-6 ${
            index < Math.floor(rating)
              ? 'text-yellow-400 fill-current'
              : index < Math.ceil(rating)
                ? 'text-yellow-400 fill-current half-star'
                : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

export default async function Page({ params }: { params: { id: string } }) {
  const book = await fetchBookById(params.id);

  return (
    <ScrollArea className="p-4">
      <div className="flex flex-col items-center w-full">
        <Link className="p-3 mb-8 mr-auto rounded hover:bg-gray-100" href="/">
          ← Back to all books
        </Link>
        <div className="flex flex-col w-full md:flex-row">
          <div className="w-1/4 mr-6 flex-none relative aspect-[2/3] mb-6">
            <Photo src={book.image ?? ''} title={book.title} />
          </div>
          <div>
            <div className="mb-2 text-5xl font-bold">{book.title}</div>
            <div className="mb-4 text-lg">{book.author}</div>
            <StarRating rating={book.rating} />
            <div className="mt-4 opacity-80">{book.description}</div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
