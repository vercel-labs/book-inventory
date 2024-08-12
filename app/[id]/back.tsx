'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  let router = useRouter();

  function handleClick() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <button
      onClick={handleClick}
      className="p-3 mb-8 mr-auto rounded hover:bg-gray-100"
    >
      ← Back to all books
    </button>
  );
}
