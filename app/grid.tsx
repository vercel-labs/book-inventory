import { fetchFilteredBooks } from "./lib/data";
import Link from "next/link";
import Tile from "./tile";

export default async function Grid({
  selectedAuthors,
  query,
}: {
  selectedAuthors: string[];
  query: string;
}) {
  const data = await fetchFilteredBooks(selectedAuthors, query);
  return (
    <>
      <div className="grid w-full grid-cols-2 gap-6 mt-6 sm:grid-cols-3 lg:grid-cols-5">
        {data.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full">
            No books found.
          </p>
        ) : (
          data.map((book) => (
            <Link
              href={`/${book.id}`}
              key={book.id}
              prefetch={true}
              className="mb-auto transition ease-in-out hover:scale-110 bg-white/10"
            >
              <div className="relative w-full aspect-[2/3]">
                <Tile src={book.image} title={book.title} />
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
