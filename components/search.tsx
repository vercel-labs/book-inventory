'use client';

import Form from 'next/form';
import { useFormStatus } from 'react-dom';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useRef } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

function SearchBase({ initialQuery }: { initialQuery: string }) {
  let inputRef = useRef<HTMLInputElement>(null);
  let formRef = useRef<HTMLFormElement>(null);

  let handleInputChange = useDebouncedCallback((e) => {
    e.preventDefault();
    formRef.current?.requestSubmit();
  }, 200);

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
        className="w-full rounded-none border-0 px-10 py-6 m-1 focus-visible:ring-0 text-base md:text-sm"
      />
      <LoadingIcon />
    </Form>
  );
}

function LoadingIcon() {
  let { pending } = useFormStatus();

  return pending ? (
    <div
      data-pending={pending ? '' : undefined}
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

export function SearchFallback() {
  return <SearchBase initialQuery="" />;
}

export function Search() {
  let query = useSearchParams().get('q') ?? '';
  return <SearchBase initialQuery={query} />;
}
