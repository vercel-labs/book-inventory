import { fetchBookById } from "../lib/data";
import Link from "next/link";
import Tile from "../tile";

export default async function Page({ params }: { params: { id: string } }) {
  const book = await fetchBookById(params.id);
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Link
        className="p-3 mr-auto text-white bg-black rounded dark:bg-white/10 hover:opacity-80"
        href="/"
      >
        ← Back to all books
      </Link>
      <div className="flex flex-col items-center justify-center p-6 mt-8 bg-white rounded shadow-md md:w-2/3 dark:bg-white/10">
        <div className="mb-4 text-3xl font-bold text-center">{book.title}</div>
        <div className="relative w-1/4 aspect-[2/3]">
          <Tile src={book.image} title={book.title} />
        </div>
        <div className="pt-6">
          <div>Written By: {book.author}</div>
          <div>Published In: {book.year}</div>
          <div>Published By: {book.publisher}</div>
        </div>
      </div>
    </div>
  );
}
