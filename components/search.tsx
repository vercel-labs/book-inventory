'use client';

import { useEffect, useRef, useState, useDeferredValue } from 'react';
import { useFormStatus } from 'react-dom';
import Form from 'next/form';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Search({ query: initialQuery }: { query: string }) {
  let [query, setQuery] = useState(initialQuery);
  let deferredQuery = useDeferredValue(query);
  let inputRef = useRef<HTMLInputElement>(null);
  let formRef = useRef<HTMLFormElement>(null);
  let isStale = query !== deferredQuery;

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    formRef.current?.requestSubmit();
  }

  return (
    <Form
      ref={formRef}
      action="/"
      replace
      className="relative flex flex-1 flex-shrink-0 w-full"
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        onChange={handleInputChange}
        type="text"
        name="search"
        id="search"
        placeholder="Search books..."
        value={query}
        className="w-full rounded-none border-0 px-10 py-6 m-1 focus-visible:ring-0 text-base md:text-sm"
      />
      <LoadingIcon isStale={isStale} />
    </Form>
  );
}

function LoadingIcon({ isStale }: { isStale: boolean }) {
  let { pending } = useFormStatus();
  let loading = pending || isStale;

  return loading ? (
    <div
      data-pending={loading ? '' : undefined}
      className="absolute right-3 top-1/2 -translate-y-1/2"
    >
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  ) : null;
}
