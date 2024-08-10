import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { cn } from '@/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  title: 'Book Inventory',
  description: 'A simple book inventory app.',
};

export default function RootLayout({
  sidebar,
  grid,
  children,
}: Readonly<{
  sidebar: React.ReactNode;
  grid: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          GeistSans.variable
        )}
      >
        <div className="flex h-screen w-full overflow-hidden">
          {sidebar}
          <div className="flex flex-1 flex-col">
            <div className="border-b">{children}</div>
            <div className="flex-1 flex flex-col overflow-hidden">{grid}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
