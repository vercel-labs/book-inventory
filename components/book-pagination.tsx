import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function BookPagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set('page', pageNumber.toString());
    return `?${params.toString()}`;
  };

  const shouldShowPage = (pageNumber: number) => {
    return (
      pageNumber === 1 ||
      pageNumber === totalPages ||
      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
    );
  };

  const shouldShowEllipsis = (pageNumber: number) => {
    return pageNumber === currentPage - 2 || pageNumber === currentPage + 2;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            aria-disabled={currentPage <= 1}
          />
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          if (shouldShowPage(pageNumber)) {
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href={createPageURL(pageNumber)}
                  isActive={pageNumber === currentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          } else if (shouldShowEllipsis(pageNumber)) {
            return <PaginationEllipsis key={i} />;
          }
          return null;
        })}
        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
