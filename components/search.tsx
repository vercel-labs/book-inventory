'use client';

import Form from 'next/form';
import { useFormStatus } from 'react-dom';
import { useCallback, useEffect, useRef } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

function useSearch() {
  let router = useRouter();
  let latestQuery = useRef('');
  let updateTimeout = useRef<NodeJS.Timeout | null>(null);

  let updateSearch = useCallback(
    (query: string) => {
      latestQuery.current = query;

      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }

      updateTimeout.current = setTimeout(() => {
        router.replace(`/?search=${encodeURIComponent(query)}`);
      }, 400);
    },
    [router]
  );

  return { updateSearch, latestQuery };
}

function SearchBase({ initialQuery }: { initialQuery: string }) {
  let { updateSearch, latestQuery } = useSearch();
  let inputRef = useRef<HTMLInputElement>(null);
  let formRef = useRef<HTMLFormElement>(null);

  let handleInputChange = (e) => {
    e.preventDefault();
    updateSearch(e.target.value);
    formRef.current?.requestSubmit();
  };

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, []);

  return (
    <Form
      ref={formRef}
      action="/"
      replace
      className="relative flex flex-1 flex-shrink-0 w-full rounded shadow-sm"
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        onChange={handleInputChange}
        type="text"
        name="search"
        id="search"
        placeholder="Search books..."
        defaultValue={initialQuery}
        className="w-full border-0 px-10 py-6 text-base md:text-sm overflow-hidden focus-visible:ring-0"
      />
      <LoadingSpinner />
    </Form>
  );
}

function LoadingSpinner() {
  let { pending } = useFormStatus();

  return (
    <div
      data-pending={pending ? '' : undefined}
      className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-300"
    >
      <svg className="h-5 w-5" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="282.7"
          strokeDashoffset="282.7"
          className={`${pending ? 'animate-fill-clock' : ''}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
    </div>
  );
}

export function SearchFallback() {
  return <SearchBase initialQuery="" />;
}

export function Search() {
  let query = useSearchParams().get('q') ?? '';
  return <SearchBase initialQuery={query} />;
}
