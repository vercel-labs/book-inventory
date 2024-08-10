import { Suspense } from 'react';
import { fetchPages } from '@/lib/data';
import { BooksGrid } from '@/components/grid';
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
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto min-h-[200px]">
        <div className="p-4">
          <BooksGrid
            selectedAuthors={selectedAuthors}
            query={query}
            page={currentPage}
          />
        </div>
      </div>
      <div className="mt-auto p-4 border-t">
        <Suspense fallback={null}>
          <BookPagination totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}
