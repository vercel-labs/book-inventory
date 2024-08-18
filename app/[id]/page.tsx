import { fetchBookById, fetchBooksWithPagination } from '@/lib/db/queries';
import { Photo } from '@/components/photo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BackButton } from './back';
import { StarRating } from './rating';

// Prerender the first page of books
export async function generateStaticParams() {
  const books = await fetchBooksWithPagination({});

  return books.map((books) => ({
    id: books.id.toString(),
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const book = await fetchBookById(params.id);

  return (
    <ScrollArea className="px-4 h-full">
      <div className="flex flex-col items-center w-full h-full">
        <BackButton />
        <div className="flex flex-col w-full md:flex-row">
          <div className="w-1/4 mr-6 flex-none relative aspect-[2/3] mb-6">
            <Photo src={book.image_url ?? ''} title={book.title} />
          </div>
          <div>
            <div className="mb-2 text-2xl md:text-5xl font-bold">
              {book.title}
            </div>
            <div className="mb-4 text-lg">
              {book.authors.map((author) => author)}
            </div>
            <StarRating rating={book.average_rating} />
            <div className="mt-4 opacity-80">{book.description}</div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
