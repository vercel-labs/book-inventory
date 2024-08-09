import { fetchBookById } from '../lib/data';
import Link from 'next/link';
import { Photo } from '../components/photo';

export default async function Page({ params }: { params: { id: string } }) {
  const book = await fetchBookById(params.id);
  return (
    <div className="flex flex-col items-center w-full">
      <Link
        className="p-3 mb-8 mr-auto rounded dark:text-white hover:opacity-80"
        href="/"
      >
        ← Back to all books
      </Link>
      <div className="flex flex-col w-full md:flex-row">
        <div className="w-1/4 mr-6 flex-none relative aspect-[2/3] mb-6">
          <Photo src={book.image!} title={book.title} />
        </div>
        <div>
          <div className="mb-2 text-5xl font-bold">{book.title}</div>
          <div className="mb-4 text-lg">{book.author}</div>
          <StarRating rating={book.rating} />
          <div className="mt-4 opacity-80">{book.description}</div>
        </div>
      </div>
    </div>
  );
}

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  let remainingRating = rating;

  // Generate stars based on the rating
  const stars = Array.from({ length: totalStars }).map((_, index) => {
    let fill = 'white';
    if (remainingRating >= 1) {
      fill = 'gold';
      remainingRating -= 1;
    } else if (remainingRating > 0) {
      fill = 'half';
      remainingRating = 0;
    }
    return <SVGStar key={index} fill={fill} />;
  });

  return <div className="flex space-x-1">{stars}</div>;
};

const SVGStar = ({ fill = 'none' }) => {
  const fillColor = fill === 'half' ? 'url(#half)' : fill;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="gold" />
          <stop offset="50%" stopColor="white" />
        </linearGradient>
      </defs>
      <path
        fill={fillColor}
        d="M12 .587l3.668 7.425 8.2.637-6 5.847 1.4 8.174L12 18.256l-7.268 3.414 1.4-8.174-6-5.847 8.2-.637L12 .587z"
      />
    </svg>
  );
};
