import Grid from './grid';
import Panel from './panel';
import Search from './search';
import { Suspense } from 'react';
import { fetchAuthors } from './lib/data';
import { LoadingSkeleton } from './loading-skeleton';

export default async function Page({
	searchParams
}: {
	searchParams: { query?: string; author?: string | string[] };
}) {
	const query = searchParams?.query || '';
	const allAuthors = await fetchAuthors();
	const selectedAuthors = !searchParams.author
		? []
		: typeof searchParams.author === 'string'
			? [searchParams.author]
			: searchParams.author;

	return (
		<main className="flex flex-col justify-between w-full">
			<Search placeholder="Search books..." />
			<div className="flex flex-col gap-6 py-6 lg:flex-row">
				<Panel authors={selectedAuthors} allAuthors={allAuthors} />
				<Suspense fallback={<LoadingSkeleton />}>
					<Grid selectedAuthors={selectedAuthors} query={query} />
				</Suspense>
			</div>
		</main>
	);
}
