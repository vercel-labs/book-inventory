import { fetchBookById } from '../lib/data';
import Link from 'next/link';
import Tile from '../tile';

export default async function Page({ params }: { params: { id: string } }) {
	const book = await fetchBookById(params.id);
	return (
		<div className="w-full flex flex-col items-center">
			<Link
				className="p-3 mr-auto dark:text-white rounded mb-8 hover:font-bold hover:opacity-80"
				href="/"
			>
				← Back to all books
			</Link>
			<div className="hidden md:block relative w-1/5 aspect-[2/3]">
				<Tile src={book.image} title={book.title} />
			</div>
			<div className="md:w-2/3 dark:bg-white/10 bg-white rounded-lg p-6 md:px-10 md:pb-10 md:pt-32 md:-mt-20 flex flex-col items-center">
				<div className="md:hidden relative w-1/2 md:w-1/5 aspect-[2/3] mb-6">
					<Tile src={book.image} title={book.title} />
				</div>
				<div className="text-3xl font-bold text-center mb-6">{book.title}</div>
				<div>Written By: {book.author}</div>
				<div>Published In: {book.year}</div>
				<div>Published By: {book.publisher}</div>
			</div>
		</div>
	);
}
