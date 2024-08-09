'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams } from 'next/navigation';

const getPaginationPages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  if (currentPage <= 3) return [1, 2, 3, '...', totalPages - 1, totalPages];
  if (currentPage >= totalPages - 2)
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export default function Pagination({ totalPages }: { totalPages: number }) {
  let pathname = usePathname();
  let searchParams = useSearchParams();
  let currentPage = Number(searchParams.get('page')) || 1;

  let createPageURL = (pageNumber: number | string) => {
    let params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  let pages = getPaginationPages(currentPage, totalPages);

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />
      <div className="flex -space-x-px">
        {pages.map((page, index) => (
          <PaginationItem
            key={index}
            href={createPageURL(page)}
            page={page}
            isActive={currentPage === page}
            isFirst={index === 0}
            isLast={index === pages.length - 1}
          />
        ))}
      </div>
      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationItem({
  page,
  href,
  isActive,
  isFirst,
  isLast,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  let className = clsx('flex h-10 w-10 items-center justify-center text-sm', {
    'rounded-l-md': isFirst || page === 'single',
    'rounded-r-md': isLast || page === 'single',
    'z-10 font-bold text-black dark:text-white': isActive,
    'text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white':
      !isActive && page !== '...',
  });

  return isActive || page === '...' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  let className = clsx('flex h-10 w-10 items-center justify-center', {
    'pointer-events-none text-gray-300': isDisabled,
    'hover:text-black dark:hover:text-white': !isDisabled,
    'mr-2 md:mr-4': direction === 'left',
    'ml-2 md:ml-4': direction === 'right',
  });

  let Icon = direction === 'left' ? ArrowLeftIcon : ArrowRightIcon;

  return isDisabled ? (
    <div className={className}>
      <Icon className="w-4" />
    </div>
  ) : (
    <Link className={className} href={href}>
      <Icon className="w-4" />
    </Link>
  );
}
