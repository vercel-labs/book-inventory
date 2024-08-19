import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Loading() {
  return (
    <ScrollArea className="px-4 h-full">
      <Button variant="ghost" className="mb-4">
        <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Books
      </Button>
    </ScrollArea>
  );
}
