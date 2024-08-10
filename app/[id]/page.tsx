import Link from 'next/link';
import { fetchBookById } from '@/lib/data';
import { Photo } from '@/components/grid';
import { Star } from 'lucide-react';

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
    <div className="container mx-auto p-4">
      <Link
        className="inline-flex items-center p-3 mb-8 rounded hover:bg-gray-100"
        href="/"
      >
        ← Back to all books
      </Link>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 aspect-[2/3]">
          <Photo src={book.image ?? ''} title={book.title} />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl mb-4">{book.author}</p>
          <StarRating rating={book.rating} />
          <p className="mt-4 text-gray-600">{book.description}</p>
        </div>
      </div>
    </div>
  );
}
