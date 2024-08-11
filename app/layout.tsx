import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Toaster } from 'sonner';
import { WelcomeToast } from '@/components/welcome-toast';
import { cn } from '@/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  title: 'Book Inventory',
  description: 'A simple book inventory app.',
};

export default function RootLayout({
  sidebar,
  search,
  children,
}: Readonly<{
  sidebar: React.ReactNode;
  search: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-[calc(100dvh)] bg-white font-sans antialiased dark:bg-black dark:text-white',
          GeistSans.variable
        )}
      >
        <div className="group flex h-[calc(100dvh)] w-full overflow-hidden">
          <div className="hidden md:block">{sidebar}</div>
          <div className="flex flex-1 flex-col">
            <div className="border-b">{search}</div>
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </div>
        <Toaster closeButton />
        <WelcomeToast />
      </body>
    </html>
  );
}
