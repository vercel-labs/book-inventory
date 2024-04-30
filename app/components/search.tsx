'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';

export default function Search() {
	const [loading, setLoading] = useState(false);
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();
	const handleSearch = useDebouncedCallback((term) => {
		const params = new URLSearchParams(searchParams);
		params.set('page', '1');
		if (term) {
			params.set('query', term);
		} else {
			params.delete('query');
		}
		replace(`${pathname}?${params.toString()}`);
		setLoading(false);
	}, 300);

	return (
		<div className="relative flex flex-1 flex-shrink-0 w-full text-black">
			<label htmlFor="search" className="sr-only">
				Search
			</label>
			<input
				className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
				placeholder="Search books..."
				id="search"
				onChange={(e) => {
					setLoading(true);
					handleSearch(e.target.value);
				}}
				defaultValue={searchParams.get('query')?.toString()}
			/>
			{loading && (
				<div className="absolute right-3 h-full flex items-center justify-center bg-opacity-80 z-10">
					<div
						className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-black motion-reduce:animate-[spin_1.5s_linear_infinite] "
						role="status"
					>
						<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
							Loading...
						</span>
					</div>
				</div>
			)}
			<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
		</div>
	);
}
