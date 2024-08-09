import { Suspense } from 'react';
import { fetchPages } from '@/lib/data';
import { BooksGrid } from '@/components/grid';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { BookPagination } from '@/components/book-pagination';

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string; author?: string | string[]; page?: string };
}) {
  const query = searchParams?.q || '';
  const currentPage = Number(searchParams?.page) || 1;
  const selectedAuthors = !searchParams.author
    ? []
    : typeof searchParams.author === 'string'
      ? [searchParams.author]
      : searchParams.author;
  const totalPages = await fetchPages(query, selectedAuthors);

  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        <Suspense fallback={<LoadingSkeleton />}>
          <BooksGrid
            selectedAuthors={selectedAuthors}
            query={query}
            page={currentPage}
          />
        </Suspense>
        <div className="mt-8 flex justify-center">
          <BookPagination totalPages={totalPages} />
        </div>
      </div>
    </ScrollArea>
  );
}
