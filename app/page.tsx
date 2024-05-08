import Grid from "./components/grid";
import Panel from "./components/panel";
import Search from "./components/search";
import { Suspense } from "react";
import { fetchAuthors } from "./lib/data";
import { LoadingSkeleton } from "./components/loading-skeleton";
import { fetchPages } from "./lib/data";
import Pagination from "./components/pagination";

export default async function Page({
  searchParams,
}: {
  searchParams: { query?: string; author?: string | string[]; page?: string };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const allAuthors = await fetchAuthors();
  console.log(allAuthors);
  const selectedAuthors = !searchParams.author
    ? []
    : typeof searchParams.author === "string"
      ? [searchParams.author]
      : searchParams.author;
  const totalPages = await fetchPages(query, selectedAuthors);

  if (!allAuthors) {
    return (
      <div className="max-w-md p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-bold text-center text-gray-900">
          Database Setup Required
        </h2>
        <p className="text-gray-700">
          Your database does not have a{" "}
          <code className="p-1 font-mono text-red-600 bg-gray-200 rounded">
            books
          </code>{" "}
          table. Please run the script{" "}
          <code className="p-1 font-mono text-green-600 bg-gray-200 rounded">
            npm run seed
          </code>{" "}
          to create the table and seed it with data.
        </p>
      </div>
    );
  }

  return (
    <main className="flex flex-col justify-between w-full">
      <Search />
      <div className="flex justify-center w-full mt-5">
        <Pagination totalPages={totalPages} />
      </div>
      <div className="flex flex-col gap-6 py-6 lg:flex-row">
        <Panel authors={selectedAuthors} allAuthors={allAuthors} />
        <Suspense fallback={<LoadingSkeleton />}>
          <Grid
            selectedAuthors={selectedAuthors}
            query={query}
            page={currentPage}
          />
        </Suspense>
      </div>
      <div className="flex justify-center w-full mt-5">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
