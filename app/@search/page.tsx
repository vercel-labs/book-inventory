import { Search } from '@/components/search';

export default function Page({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const query = searchParams?.search || '';

  return <Search query={query} />;
}
