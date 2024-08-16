'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  let router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="px-3 mb-8 mr-auto rounded hover:bg-gray-100"
    >
      ← Back to all books
    </button>
  );
}
