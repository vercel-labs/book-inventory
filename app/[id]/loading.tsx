import { ScrollArea } from '@/components/ui/scroll-area';
import { BackButton } from './back';

export default function Loading() {
  return (
    <ScrollArea className="px-4 h-full">
      <div className="flex flex-col items-center w-full h-full">
        <BackButton />
      </div>
    </ScrollArea>
  );
}
