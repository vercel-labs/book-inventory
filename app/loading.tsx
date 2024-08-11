import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto min-h-[200px]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 p-4">
          {Array.from({ length: 30 }).map((_, index) => (
            <div
              key={index}
              className="relative aspect-[2/3] w-full overflow-hidden rounded-md"
            >
              <Skeleton className="absolute inset-0" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="h-10" />
      </div>
    </div>
  );
}
