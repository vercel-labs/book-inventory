'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  useOptimistic,
  useTransition,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChevronRight, Filter, X } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { FixedSizeList as List } from 'react-window';
import { Author } from '@/lib/db/schema';

function filterAuthors(authors: Author[], filterText: string) {
  return authors.filter((author) =>
    author.name.toLowerCase().includes(filterText.toLowerCase())
  );
}

function createAuthorGroups(authors: Author[]) {
  const groups: Record<string, Author[]> = {};
  for (let i = 65; i <= 90; i++) {
    groups[String.fromCharCode(i)] = [];
  }
  groups['Other'] = [];

  authors.forEach((author) => {
    const firstLetter = author.name[0].toUpperCase();
    if (firstLetter >= 'A' && firstLetter <= 'Z') {
      groups[firstLetter].push(author);
    } else {
      groups['Other'].push(author);
    }
  });

  return groups;
}

interface AuthorsProps {
  allAuthors: Author[];
  searchParams: URLSearchParams;
}

function AuthorsBase({ allAuthors, searchParams }: AuthorsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const selectedAuthors = useMemo(() => {
    const authorParams = searchParams.getAll('author');
    return authorParams.length > 0 ? authorParams : [];
  }, [searchParams]);

  const [optimisticAuthors, setOptimisticAuthors] =
    useOptimistic(selectedAuthors);
  const [filterText, setFilterText] = useState('');

  const filteredAuthors = allAuthors
    ? filterAuthors(allAuthors, filterText)
    : [];
  const authorGroups = createAuthorGroups(filteredAuthors);

  const handleAuthorToggle = useCallback(
    (authorId: string) => {
      if (!allAuthors) return;
      startTransition(() => {
        const newAuthors = optimisticAuthors.includes(authorId)
          ? optimisticAuthors.filter((a) => a !== authorId)
          : [...optimisticAuthors, authorId];

        setOptimisticAuthors(newAuthors.sort());

        const newParams = new URLSearchParams(searchParams);
        newParams.delete('author');
        newAuthors.forEach((author) => newParams.append('author', author));
        router.push(`/?${newParams}`);
      });
    },
    [optimisticAuthors, router, allAuthors, searchParams]
  );

  const handleClearAuthors = useCallback(() => {
    startTransition(() => {
      setOptimisticAuthors([]);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('author');
      router.push(`/?${newParams}`);
    });
  }, [router, searchParams]);

  return (
    <div
      data-pending={isPending ? '' : undefined}
      className="flex-shrink-0 flex flex-col h-full bg-white"
    >
      <div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Filter authors..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-8"
          />
          <Filter className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <ScrollArea className="flex-grow border-t mt-4">
        <div className="py-2">
          {Object.entries(authorGroups).map(
            ([letter, authors]) =>
              (authors.length > 0 || !allAuthors) && (
                <Collapsible key={letter}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 mb-1 text-left hover:bg-accent rounded-md">
                    <span>
                      {letter}
                      {allAuthors && (
                        <span className="text-xs"> ({authors.length})</span>
                      )}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </CollapsibleTrigger>
                  {allAuthors && (
                    <CollapsibleContent className="ml-2 space-y-1">
                      <List
                        height={Math.min(authors.length * 30, 300)}
                        itemCount={authors.length}
                        itemSize={30}
                        width="100%"
                      >
                        {({ index, style }) => {
                          const author = authors[index];
                          return (
                            <div
                              style={style}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`${letter}-${author.id}`}
                                checked={optimisticAuthors.includes(author.id)}
                                onCheckedChange={() =>
                                  handleAuthorToggle(author.id)
                                }
                              />
                              <label
                                htmlFor={`${letter}-${author.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                              >
                                {author.name}
                              </label>
                            </div>
                          );
                        }}
                      </List>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              )
          )}
        </div>
      </ScrollArea>
      {allAuthors && optimisticAuthors.length > 0 && (
        <div className="py-4 border-t">
          <div className="mb-2 text-sm font-medium">Selected Authors:</div>
          <ScrollArea className="w-full whitespace-nowrap mb-2">
            <div className="flex space-x-2">
              {optimisticAuthors.map((authorId, index) => {
                const author = allAuthors.find((a) => a.id === authorId);
                return author ? (
                  <Button
                    key={authorId + index}
                    variant="secondary"
                    size="sm"
                    className="flex items-center shrink-0"
                    onClick={() => handleAuthorToggle(authorId)}
                  >
                    {author.name}
                    <X className="w-3 h-3 ml-1" />
                  </Button>
                ) : null;
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearAuthors}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}

export function AuthorsFallback({ allAuthors }: { allAuthors: Author[] }) {
  return (
    <AuthorsBase allAuthors={allAuthors} searchParams={new URLSearchParams()} />
  );
}

export function Authors({ allAuthors }: { allAuthors: Author[] }) {
  const searchParams = useSearchParams();
  return <AuthorsBase allAuthors={allAuthors} searchParams={searchParams} />;
}
