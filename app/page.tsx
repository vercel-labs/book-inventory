import { Suspense } from 'react';
import { BooksGrid } from '@/components/grid';
import { BookPagination } from '@/components/book-pagination';
import { fetchBooksWithPagination } from '@/lib/data';

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string; author?: string | string[]; page?: string };
}) {
  const { books, pagination } = await fetchBooksWithPagination(searchParams);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto min-h-[200px]">
        <div className="group-has-[[data-pending]]:animate-pulse p-4">
          <BooksGrid books={books} />
        </div>
      </div>
      <div className="mt-auto p-4 border-t">
        <Suspense fallback={null}>
          <BookPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
}
