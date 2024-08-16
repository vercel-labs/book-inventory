'use client';

import Form from 'next/form';
import { useFormStatus } from 'react-dom';
import { useRef, use, useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchBase({ initialQuery }: { initialQuery: string }) {
  let router = useRouter();
  let [inputValue, setInputValue] = useState(initialQuery);
  let latestUrlRef = useRef(`/?search=${encodeURIComponent(initialQuery)}`);
  let isUpdatingRef = useRef(false);
  let inputRef = useRef<HTMLInputElement>(null);
  let formRef = useRef<HTMLFormElement>(null);
  let updateCountRef = useRef(0);

  async function handleSubmit(formData: FormData) {
    let query = formData.get('search') as string;
    let newUrl = `/?search=${encodeURIComponent(query)}`;
    latestUrlRef.current = newUrl;
    updateCountRef.current++;

    if (!isUpdatingRef.current) {
      isUpdatingRef.current = true;
      let currentUpdateCount = updateCountRef.current;

      router.replace(newUrl);

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          isUpdatingRef.current = false;
          if (updateCountRef.current !== currentUpdateCount) {
            formRef.current?.requestSubmit();
          }
          resolve();
        }, 300);
      });
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let newValue = e.target.value;
    setInputValue(newValue);
    formRef.current?.requestSubmit();
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  if (updateCountRef.current > 0 && !isUpdatingRef.current) {
    use(Promise.resolve()); // Suspend to trigger a re-render
  }

  return (
    <Form
      ref={formRef}
      action={handleSubmit}
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
        value={inputValue}
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
          className={pending ? 'animate-fill-clock' : ''}
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
