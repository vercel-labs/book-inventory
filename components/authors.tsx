'use client';

import { useRouter } from 'next/navigation';
import {
  useOptimistic,
  useTransition,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, ChevronDown, Filter } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SidebarProps {
  selectedAuthors: string[];
  allAuthors: string[];
}

export function Sidebar({ selectedAuthors, allAuthors }: SidebarProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimisticAuthors, setOptimisticAuthors] =
    useOptimistic(selectedAuthors);
  const [isPanelVisible, setPanelVisibility] = useState(false);

  const authorGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (let i = 65; i <= 90; i++) {
      groups[String.fromCharCode(i)] = [];
    }
    groups['Other'] = [];

    allAuthors.forEach((author) => {
      const firstLetter = author[0].toUpperCase();
      if (firstLetter >= 'A' && firstLetter <= 'Z') {
        groups[firstLetter].push(author);
      } else {
        groups['Other'].push(author);
      }
    });

    return groups;
  }, [allAuthors]);

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
    <div className="w-[300px] flex-shrink-0 border-r">
      <Button
        variant="ghost"
        className="flex items-center w-full py-2 lg:hidden"
        onClick={() => setPanelVisibility(!isPanelVisible)}
      >
        <Filter className="w-4 h-4 mr-2" />
        <span>Filter Authors</span>
        <ChevronDown
          className={`w-4 h-4 ml-auto transition-transform duration-200 ${isPanelVisible ? 'rotate-180' : ''}`}
        />
      </Button>
      <ScrollArea
        className={`h-full ${isPanelVisible ? '' : 'hidden lg:block'}`}
      >
        <div className="p-4">
          <h2 className="mb-2 text-lg font-semibold">Authors</h2>
          {Object.entries(authorGroups).map(
            ([letter, authors]) =>
              authors.length > 0 && (
                <Collapsible key={letter}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 mb-1 text-left hover:bg-accent rounded-md">
                    <span>
                      {letter}{' '}
                      <span className="text-xs">({authors.length})</span>
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-2 space-y-1">
                    {authors.map((author) => (
                      <div key={author} className="flex items-center space-x-2">
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
                </Collapsible>
              )
          )}
        </div>
      </ScrollArea>
      {optimisticAuthors.length > 0 && (
        <div className="p-4 border-t">
          <div className="mb-2 text-sm font-medium">Selected Authors:</div>
          <div className="mb-2 text-sm">
            {optimisticAuthors.map((author) => (
              <div key={author}>{author}</div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearAuthors}
          >
            Clear authors
          </Button>
        </div>
      )}
    </div>
  );
}
