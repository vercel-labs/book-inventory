'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes('books-toast=2')) {
      toast('📚 Welcome to Next.js Books!', {
        id: 'books-toast',
        duration: Infinity,
        onDismiss: () => {
          document.cookie = 'books-toast=2; max-age=31536000; path=/';
        },
        description: (
          <>
            This is a demo of searching, filtering, and paginating 50,000 books
            from Postgres.{' '}
            <a
              href="https://vercel.com/templates/next.js/next-book-inventory"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              Deploy your own
            </a>
            .
          </>
        ),
      });
    }
  }, []);

  return null;
}
