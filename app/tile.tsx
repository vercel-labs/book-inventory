'use client';
import { useState } from 'react';
import Image from 'next/image';
import { BookSkeleton } from './loading-skeleton';

const Page = ({ src, title }: { src: string; title: string }) => {
	const [isOptimized, setIsOptimized] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	return (
		<div>
			{isLoading && <BookSkeleton />}
			<Image
				id="img"
				alt={title}
				src={src}
				width="200"
				height="200"
				unoptimized={!isOptimized}
				className="absolute inset-0 object-cover w-full h-full rounded-lg shadow-sm "
				onError={() => {
					setIsOptimized(false);
				}}
				onLoad={() => {
					setIsLoading(false);
				}}
			/>
		</div>
	);
};

export default Page;
