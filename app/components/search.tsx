'use client';

import Form from 'next/form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useRef } from 'react';

export function Search() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleInputChange = useDebouncedCallback((e) => {
    e.preventDefault();
    formRef.current?.requestSubmit();
  }, 300);

  useEffect(() => {
    formRef.current?.querySelector('input')?.focus();
  }, []);

  return (
    <Form
      ref={formRef}
      action="/"
      className="relative flex flex-1 flex-shrink-0 w-full text-black"
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        onChange={handleInputChange}
        key={searchParams?.get('q')}
        type="text"
        name="q"
        placeholder="Search books..."
        defaultValue={searchParams?.get('q') || ''}
        className="peer block w-full rounded-md bg-white border border-gray-300 py-[9px] pl-10 text-sm placeholder:text-gray-500"
      />
      <LoadingIcon />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </Form>
  );
}

function LoadingIcon() {
  const { pending } = useFormStatus();

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
