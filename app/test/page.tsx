import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

function BooksGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {[...Array(12)].map((_, index) => (
        <div
          key={index}
          className="aspect-[2/3] overflow-hidden rounded-md bg-muted"
        >
          <img
            alt="Book cover"
            className="h-full w-full object-cover"
            height="300"
            src="/placeholder.svg?height=300&width=200"
            style={{
              aspectRatio: '200/300',
              objectFit: 'cover',
            }}
            width="200"
          />
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <BooksGrid />
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
