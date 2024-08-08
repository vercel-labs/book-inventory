import { PhotoIcon } from '@heroicons/react/24/outline';

export function LoadingSkeleton() {
  return (
    <div className="grid w-full grid-cols-2 gap-6 mt-6 sm:grid-cols-3 lg:grid-cols-5">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="mb-auto transition ease-in-out hover:scale-110 bg-white/10"
        >
          <div className="relative w-full aspect-[2/3]">
            <BookSkeleton />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookSkeleton() {
  const shimmer =
    'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent dark:before:via-white/20 before:via-stone-100 before:to-transparent';

  return (
    <div className="absolute inset-0 flex items-center justify-center object-cover w-full h-full rounded-lg shadow-sm">
      <div
        className={`${shimmer} flex items-center justify-center relative overflow-hidden rounded-xl dark:bg-stone-900 bg-white p-2 shadow-sm w-full h-full`}
      >
        <PhotoIcon className="w-10 opacity-30" />
      </div>
    </div>
  );
}
