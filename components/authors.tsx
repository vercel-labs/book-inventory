'use client';

import { useRouter } from 'next/navigation';
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

function filterAuthors(authors: string[], filterText: string) {
  return authors.filter((author) =>
    author.toLowerCase().includes(filterText.toLowerCase())
  );
}

function createAuthorGroups(authors: string[]) {
  const groups: Record<string, string[]> = {};
  for (let i = 65; i <= 90; i++) {
    groups[String.fromCharCode(i)] = [];
  }
  groups['Other'] = [];

  authors.forEach((author) => {
    const firstLetter = author[0].toUpperCase();
    if (firstLetter >= 'A' && firstLetter <= 'Z') {
      groups[firstLetter].push(author);
    } else {
      groups['Other'].push(author);
    }
  });

  return groups;
}

interface SidebarProps {
  selectedAuthors: string[] | null;
  allAuthors: string[] | null;
}

export function Sidebar({ selectedAuthors, allAuthors }: SidebarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialSelectedAuthors = useMemo(() => {
    if (!selectedAuthors) return [];
    return selectedAuthors;
  }, [selectedAuthors]);

  const [optimisticAuthors, setOptimisticAuthors] = useOptimistic(
    initialSelectedAuthors
  );
  const [filterText, setFilterText] = useState('');

  const filteredAuthors = allAuthors
    ? filterAuthors(allAuthors, filterText)
    : [];
  const authorGroups = createAuthorGroups(filteredAuthors);

  const handleAuthorToggle = useCallback(
    (author: string) => {
      if (!allAuthors) return;
      startTransition(() => {
        const newAuthors = optimisticAuthors.includes(author)
          ? optimisticAuthors.filter((a) => a !== author)
          : [...optimisticAuthors, author];

        setOptimisticAuthors(newAuthors.sort());

        const newParams = new URLSearchParams(
          newAuthors.map((author) => ['author', author])
        );
        router.push(`/?${newParams}`);
      });
    },
    [optimisticAuthors, router, allAuthors]
  );

  const handleClearAuthors = useCallback(() => {
    startTransition(() => {
      setOptimisticAuthors([]);
      router.push('/');
    });
  }, [router]);

  return (
    <div
      data-pending={isPending ? '' : undefined}
      className="w-[300px] flex-shrink-0 border-r flex flex-col h-full"
    >
      <div className="p-4 border-b">
        <h2 className="mb-2 text-lg font-semibold tracking-tight">Authors</h2>
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
      <ScrollArea className="flex-grow">
        <div className="p-4">
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
                      {authors.map((author, index) => (
                        <div
                          key={author + index}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={author}
                            checked={optimisticAuthors.includes(author)}
                            onCheckedChange={() => handleAuthorToggle(author)}
                          />
                          <label
                            htmlFor={author}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {author}
                          </label>
                        </div>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              )
          )}
        </div>
      </ScrollArea>
      {allAuthors && optimisticAuthors.length > 0 && (
        <div className="p-4 border-t">
          <div className="mb-2 text-sm font-medium">Selected Authors:</div>
          <ScrollArea className="w-full whitespace-nowrap mb-2">
            <div className="flex space-x-2">
              {optimisticAuthors.map((author, index) => (
                <Button
                  key={author + index}
                  variant="secondary"
                  size="sm"
                  className="flex items-center shrink-0"
                  onClick={() => handleAuthorToggle(author)}
                >
                  {author}
                  <X className="w-3 h-3 ml-1" />
                </Button>
              ))}
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
