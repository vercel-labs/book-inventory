import { Search } from '@/components/search';

export default function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams?.q || '';

  return <Search query={query} />;
}
