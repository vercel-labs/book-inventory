import Grid from './grid';
import Panel from './panel';
import Search from './search';
import { Suspense } from 'react';
import { fetchAuthors } from './lib/data';
import { LoadingSkeleton } from './loading-skeleton';
import { fetchPages } from './lib/data';
import Pagination from './pagination';

export default async function Page({
	searchParams
}: {
	searchParams: { query?: string; author?: string | string[]; page?: string };
}) {
	const query = searchParams?.query || '';
	const currentPage = Number(searchParams?.page) || 1;
	const allAuthors = await fetchAuthors();
	const selectedAuthors = !searchParams.author
		? []
		: typeof searchParams.author === 'string'
			? [searchParams.author]
			: searchParams.author;
	const totalPages = await fetchPages(query, selectedAuthors);

	return (
		<main className="flex flex-col justify-between w-full">
			<Search placeholder="Search books..." />
			<div className="mt-5 flex w-full justify-center">
				<Pagination totalPages={totalPages} />
			</div>
			<div className="flex flex-col gap-6 py-6 lg:flex-row">
				<Panel authors={selectedAuthors} allAuthors={allAuthors} />
				<Suspense fallback={<LoadingSkeleton />}>
					<Grid selectedAuthors={selectedAuthors} query={query} page={currentPage} />
				</Suspense>
			</div>
			<div className="mt-5 flex w-full justify-center">
				<Pagination totalPages={totalPages} />
			</div>
		</main>
	);
}
