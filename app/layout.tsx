import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

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
          inter.variable
        )}
      >
        <div className="flex h-screen w-full overflow-hidden">
          {sidebar}
          <div className="flex flex-1 flex-col">
            <div className="border-b">{children}</div>
            {grid}
          </div>
        </div>
      </body>
    </html>
  );
}
