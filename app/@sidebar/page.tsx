import { fetchAuthors } from '@/lib/data';
import { Sidebar } from '@/components/authors';

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string; author?: string | string[]; page?: string };
}) {
  const allAuthors = await fetchAuthors();
  const selectedAuthors = !searchParams.author
    ? []
    : typeof searchParams.author === 'string'
      ? [searchParams.author]
      : searchParams.author;

  return <Sidebar selectedAuthors={selectedAuthors} allAuthors={allAuthors} />;
}
