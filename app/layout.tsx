import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Toaster } from 'sonner';
import { WelcomeToast } from '@/components/welcome-toast';
import { cn } from '@/lib/utils';
import { Authors, AuthorsFallback } from '@/components/authors';
import { fetchAuthors } from '@/lib/db/queries';
import { Search, SearchFallback } from '@/components/search';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Book Inventory',
  description: 'A simple book inventory app.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allAuthors = await fetchAuthors();

  return (
    <html lang="en">
      <body
        className={cn(
          'bg-gray-100 font-sans antialiased dark:bg-black dark:text-white',
          GeistSans.variable
        )}
      >
        <div className="flex w-full">
          <div className="hidden md:block w-[300px] h-screen sticky top-0 p-8">
            <div className="h-full rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
              <div className="h-full overflow-y-auto p-4">
                <Suspense
                  fallback={<AuthorsFallback allAuthors={allAuthors} />}
                >
                  <Authors allAuthors={allAuthors} />
                </Suspense>
              </div>
            </div>
          </div>
          <div className="group flex-1 flex flex-col min-h-screen">
            <div className="sticky top-0 z-10 bg-gray-100 dark:bg-black">
              <div className="mx-8 py-4">
                <Suspense fallback={<SearchFallback />}>
                  <Search />
                </Suspense>
              </div>
            </div>
            <div className="flex-1 flex flex-col p-4">{children}</div>
          </div>
        </div>
        <Toaster closeButton />
        <WelcomeToast />
      </body>
    </html>
  );
}
