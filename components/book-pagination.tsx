'use client';

import Form from 'next/form';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';

function FormValues({
  searchParams,
  pageNumber,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  pageNumber: number;
}) {
  let { pending } = useFormStatus();

  return (
    <div data-pending={pending ? '' : undefined}>
      {/* Keep the existing search params */}
      {Object.entries(searchParams).map(
        ([key, value]) =>
          key !== 'page' && (
            <input key={key} type="hidden" name={key} value={value as string} />
          )
      )}
      <input type="hidden" name="page" value={pageNumber.toString()} />
    </div>
  );
}

export function BookPagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push('...');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push('...');
    if (totalPages > 1 && !pageNumbers.includes(totalPages))
      pageNumbers.push(totalPages);
    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Form action="/">
            <FormValues
              searchParams={searchParams}
              pageNumber={Math.max(1, currentPage - 1)}
            />
            <Button
              variant="ghost"
              type="submit"
              size="icon"
              disabled={currentPage <= 1}
            >
              ←
            </Button>
          </Form>
        </PaginationItem>

        {/* Mobile View */}
        <div className="flex md:hidden">
          <PaginationItem>
            <Form action="/">
              <FormValues
                searchParams={searchParams}
                pageNumber={currentPage}
              />
              <Button type="submit" variant="outline">
                {currentPage}
              </Button>
            </Form>
          </PaginationItem>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex">
          {getPageNumbers().map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber === '...' ? (
                <PaginationEllipsis />
              ) : (
                <Form action="/">
                  <FormValues
                    searchParams={searchParams}
                    pageNumber={pageNumber as number}
                  />
                  <Button
                    type="submit"
                    variant={pageNumber === currentPage ? 'outline' : 'ghost'}
                  >
                    {pageNumber}
                  </Button>
                </Form>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem>
          <Form action="/">
            <FormValues
              searchParams={searchParams}
              pageNumber={Math.min(totalPages, currentPage + 1)}
            />
            <Button
              variant="ghost"
              type="submit"
              size="icon"
              disabled={currentPage >= totalPages}
            >
              →
            </Button>
          </Form>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
