'use client';

import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FunnelIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ExpandedSections {
  [key: string]: boolean;
}

export default function Panel({
  selectedAuthors,
  allAuthors,
}: {
  selectedAuthors: string[];
  allAuthors: string[];
}) {
  let router = useRouter();
  let [pending, startTransition] = useTransition();
  let [optimisticAuthors, setOptimisticAuthors] =
    useOptimistic(selectedAuthors);
  let [expandedSections, setExpandedSections] = useState<ExpandedSections>({});
  let [isPanelVisible, setPanelVisibility] = useState(false);

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
      [letter]: !prev[letter],
    }));
  };

  return (
    <div>
      <button
        className="flex items-center w-full py-2 space-x-2 text-sm font-medium text-center lg:hidden "
        onClick={() => setPanelVisibility(!isPanelVisible)}
      >
        <FunnelIcon className="w-4" />
        <div className="text-sm">Filter Authors</div>
        <ChevronDownIcon
          className={clsx('w-4', { 'rotate-180': isPanelVisible })}
        />
      </button>
      <div
        className={`mb-auto bg-white lg:rounded-md shadow-md lg:w-60 dark:shadow-gray-950/30 dark:bg-white/10 ${isPanelVisible ? '' : 'hidden lg:block'}`}
      >
        <div
          data-pending={pending ? '' : undefined}
          className="lg:h-[70vh] h-80 overflow-auto"
        >
          <div className="p-4 ">
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
                        onClick={() => {
                          let newAuthors = !optimisticAuthors.includes(author)
                            ? [...optimisticAuthors, author]
                            : optimisticAuthors.filter((g) => g !== author);

                          let newParams = new URLSearchParams(
                            newAuthors
                              .sort()
                              .map((author) => ['author', author])
                          );

                          startTransition(() => {
                            setOptimisticAuthors(newAuthors.sort());

                            router.push(`?${newParams}`);
                          });
                        }}
                        key={author}
                        className="flex items-center space-x-2 text-xs text-left"
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
    </div>
  );
}
