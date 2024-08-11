'use client';

import Form from 'next/form';
import { useFormStatus } from 'react-dom';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useRef } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Search({ query }: { query: string }) {
  let formRef = useRef<HTMLFormElement | null>(null);

  let handleInputChange = useDebouncedCallback((e) => {
    e.preventDefault();
    formRef.current?.requestSubmit();
  }, 200);

  useEffect(() => {
    formRef.current?.querySelector('input')?.focus();
  }, []);

  return (
    <Form
      ref={formRef}
      action="/"
      className="relative flex flex-1 flex-shrink-0 w-full"
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        onChange={handleInputChange}
        type="text"
        name="q"
        id="search"
        placeholder="Search books..."
        defaultValue={query}
        className="w-full rounded-none border-0 px-10 py-6 m-1 focus-visible:ring-0 text-base	md:text-sm"
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
