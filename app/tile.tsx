'use client';
import { useState } from 'react';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';

const Page = ({ src, title }: { src: string; title: string }) => {
	const [isOptimized, setIsOptimized] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const shimmer =
		'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent';

	return (
		<div>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center object-cover w-full h-full rounded-lg shadow-sm">
					<div
						className={`${shimmer} flex items-center justify-center relative overflow-hidden rounded-xl dark:bg-stone-900 bg-stone-200 p-2 shadow-sm w-full h-full`}
					>
						<PhotoIcon className="w-10 opacity-40" />
					</div>
				</div>
			)}
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
				onLoadingComplete={() => {
					setIsLoading(false); // Hide loading indicator once the image is loaded
				}}
			/>
		</div>
	);
};

export default Page;
