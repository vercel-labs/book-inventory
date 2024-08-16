import { Star } from 'lucide-react';

export function StarRating({ rating }: { rating: number | null }) {
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
