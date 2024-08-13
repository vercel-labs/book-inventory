'use client';

import { useRouter } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  useDeferredValue,
  useTransition,
} from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Form from 'next/form';

export function Search({ query: initialQuery }: { query: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(function () {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, []);

  function handleSearch(formData: FormData) {
    const newQuery = formData.get('search') as string;
    setQuery(newQuery);

    startTransition(function () {
      router.replace(`/?search=${encodeURIComponent(newQuery)}`);
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    formRef.current?.requestSubmit();
  }

  const isStale = query !== deferredQuery;

  return (
    <Form
      ref={formRef}
      action={handleSearch}
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
      <LoadingIcon pending={isPending || isStale} />
    </Form>
  );
}

function LoadingIcon({ pending }: { pending: boolean }) {
  return pending ? (
    <div className="absolute right-3 top-1/2 -translate-y-1/2">
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  ) : null;
}
