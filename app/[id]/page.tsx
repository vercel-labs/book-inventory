import { fetchBookById } from '../lib/data';
import Link from 'next/link';
import Tile from '../components/tile';

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
			{/* <div className="hidden md:block relative w-1/5 aspect-[2/3]">
				<Tile src={book.image} title={book.title} />
			</div> */}
			<div className="md:w-2/3 dark:bg-white/10 bg-white rounded-lg p-6 flex flex-col items-center">
				<div className="w-full md:w-1/4 relative aspect-[2/3] mb-6">
					<Tile src={book.image} title={book.title} />
				</div>
				<div className="text-5xl font-bold text-center mb-6">{book.title}</div>
				<div className="text-lg text-center">Written By: {book.author}</div>
				<div className="text-lg text-center">Published In: {book.year}</div>
				<div className="text-lg text-center">Published By: {book.publisher}</div>
			</div>
		</div>
	);
}
