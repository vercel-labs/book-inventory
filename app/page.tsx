import { Suspense } from 'react';
import { BooksGrid } from '@/components/grid';
import { BookPagination } from '@/components/book-pagination';
import { fetchBooksWithPagination } from '@/lib/db/queries';

interface SearchParams {
  search?: string;
  yr?: string[];
  rtg?: string;
  lng?: string;
  pgs?: string[];
  page?: string;
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const parsedSearchParams: SearchParams = {
    search: searchParams.search,
    yr: searchParams.yr
      ? Array.isArray(searchParams.yr)
        ? searchParams.yr
        : [searchParams.yr]
      : undefined,
    rtg: searchParams.rtg,
    lng: searchParams.lng,
    pgs: searchParams.pgs
      ? Array.isArray(searchParams.pgs)
        ? searchParams.pgs
        : [searchParams.pgs]
      : undefined,
    page: searchParams.page,
  };

  const { books, pagination } =
    await fetchBooksWithPagination(parsedSearchParams);

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
            searchParams={parsedSearchParams}
          />
        </Suspense>
      </div>
    </div>
  );
}
