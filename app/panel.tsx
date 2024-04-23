'use client';

import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface ExpandedSections {
	[key: string]: boolean;
}

export default function Panel({
	authors,
	allAuthors
}: {
	authors: string[];
	allAuthors: string[];
}) {
	let router = useRouter();
	let [pending, startTransition] = useTransition();
	let [optimisticAuthors, setOptimisticAuthors] = useOptimistic(authors);
	let [expandedSections, setExpandedSections] = useState<ExpandedSections>({});

	const authorGroups = allAuthors.reduce(
		(acc: { [key: string]: string[] }, author: string) => {
			const firstLetter = author[0].toUpperCase(); // Get the first letter, capitalize it
			if (!acc[firstLetter]) {
				acc[firstLetter] = []; // Initialize the array if this is the first author with this letter
			}
			acc[firstLetter].push(author); // Add the author to the appropriate array
			return acc; // Return the updated accumulator
		},
		{} as { [key: string]: string[] }
	);
	const toggleSection = (letter: string): void => {
		setExpandedSections((prev: Record<string, boolean>) => ({
			...prev,
			[letter]: !prev[letter]
		}));
	};

	return (
		<div className="mb-auto bg-white rounded-md shadow-md dark:shadow-gray-950/30 dark:bg-white/10">
			<div
				data-pending={pending ? '' : undefined}
				className="lg:w-60 md:h-80 lg:h-[70vh] overflow-y-auto"
			>
				<div className="p-4">
					<h2 className="text-lg font-semibold tracking-tight dark:text-gray-100">Authors</h2>
					<div className="">
						{Object.entries(authorGroups).map(([letter, authors]) => (
							<div key={letter}>
								<button
									onClick={() => toggleSection(letter)}
									className="p-1 mb-1 rounded flex items-center justify-between w-full text-left hover:bg-stone-100 dark:hover:bg-white/20"
								>
									<div>
										{letter} <span className="text-xs">({authors.length})</span>
									</div>
									<ChevronDownIcon
										className={`w-4 ${expandedSections[letter] ? 'rotate-180' : ''}`}
									/>
								</button>
								<div
									className={`overflow-hidden transition-max-height duration-300 ease-in-out flex flex-col gap-1 ${
										expandedSections[letter] ? '' : 'max-h-0'
									}`}
								>
									{expandedSections[letter] &&
										authors.map((author) => (
											<button
												onClick={() => {
													let newAuthors = !optimisticAuthors.includes(author)
														? [...optimisticAuthors, author]
														: optimisticAuthors.filter((g) => g !== author);

													let newParams = new URLSearchParams(
														newAuthors.sort().map((author) => ['author', author])
													);

													startTransition(() => {
														setOptimisticAuthors(newAuthors.sort());

														router.push(`?${newParams}`);
													});
												}}
												key={author}
												className="flex items-center space-x-2 text-xs"
											>
												<input
													type="checkbox"
													className=""
													checked={optimisticAuthors.includes(author)}
												/>
												<div>{author}</div>
											</button>
										))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{optimisticAuthors.length > 0 && (
				<div className="p-1 bg-white border-t dark:border-black dark:bg-white/10">
					<div className="p-2 text-xs">
						{optimisticAuthors.map((author) => (
							<p key={author}>{author}</p>
						))}
					</div>
					<button
						className="w-full py-2 text-sm font-medium text-center rounded dark:hover:bg-gray-600 hover:bg-black hover:text-white"
						onClick={() => {
							startTransition(() => {
								setOptimisticAuthors([]);

								router.push(`/`);
							});
						}}
					>
						Clear authors
					</button>
				</div>
			)}
		</div>
	);
}
