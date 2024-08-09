'use client';

import { useRouter } from 'next/navigation';
import {
  useOptimistic,
  useTransition,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface AuthorFilterPanelProps {
  selectedAuthors: string[];
  allAuthors: string[];
}

export default function AuthorFilterPanel({
  selectedAuthors,
  allAuthors,
}: AuthorFilterPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimisticAuthors, setOptimisticAuthors] =
    useOptimistic(selectedAuthors);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [isPanelVisible, setPanelVisibility] = useState(false);

  const authorGroups = useMemo(() => {
    return allAuthors.reduce(
      (acc, author) => {
        const firstLetter = author[0].toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(author);
        return acc;
      },
      {} as Record<string, string[]>
    );
  }, [allAuthors]);

  const toggleSection = useCallback((letter: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [letter]: !prev[letter],
    }));
  }, []);

  const handleAuthorToggle = useCallback(
    (author: string) => {
      startTransition(() => {
        const newAuthors = optimisticAuthors.includes(author)
          ? optimisticAuthors.filter((a) => a !== author)
          : [...optimisticAuthors, author];

        setOptimisticAuthors(newAuthors.sort());

        const newParams = new URLSearchParams(
          newAuthors.map((author) => ['author', author])
        );
        router.push(`?${newParams}`);
      });
    },
    [optimisticAuthors, router]
  );

  const handleClearAuthors = useCallback(() => {
    startTransition(() => {
      setOptimisticAuthors([]);
      router.push('/');
    });
  }, [router]);

  return (
    <div>
      <button
        className="flex items-center w-full py-2 space-x-2 text-sm font-medium text-center lg:hidden"
        onClick={() => setPanelVisibility(!isPanelVisible)}
      >
        <FunnelIcon className="w-4" />
        <div className="text-sm">Filter Authors</div>
        <ChevronDownIcon
          className={clsx('w-4', { 'rotate-180': isPanelVisible })}
        />
      </button>
      <div
        className={clsx(
          'mb-auto bg-white lg:rounded-md shadow-md lg:w-60 dark:shadow-gray-950/30 dark:bg-white/10',
          { 'hidden lg:block': !isPanelVisible }
        )}
      >
        <div
          data-pending={pending ? '' : undefined}
          className="lg:h-[70vh] h-80 overflow-auto"
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold tracking-tight dark:text-gray-100">
              Authors
            </h2>
            {Object.entries(authorGroups).map(([letter, authors]) => (
              <div key={letter}>
                <button
                  onClick={() => toggleSection(letter)}
                  className="flex items-center justify-between w-full p-1 mb-1 text-left rounded hover:bg-stone-100 dark:hover:bg-white/20"
                >
                  <div>
                    {letter} <span className="text-xs">({authors.length})</span>
                  </div>
                  <ChevronDownIcon
                    className={clsx('w-4', {
                      'rotate-180': expandedSections[letter],
                    })}
                  />
                </button>
                <div
                  className={clsx(
                    'overflow-hidden transition-max-height duration-300 ease-in-out flex flex-col gap-1',
                    {
                      'max-h-0': !expandedSections[letter],
                    }
                  )}
                >
                  {expandedSections[letter] &&
                    authors.map((author) => (
                      <button
                        onClick={() => handleAuthorToggle(author)}
                        key={author}
                        className="flex items-center space-x-2 text-xs text-left"
                      >
                        <input
                          type="checkbox"
                          className=""
                          checked={optimisticAuthors.includes(author)}
                          readOnly
                        />
                        <div>{author}</div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
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
              onClick={handleClearAuthors}
            >
              Clear authors
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
