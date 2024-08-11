'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

export function Photo({
  src,
  title,
  priority = false,
}: {
  src: string;
  title: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted">
      {src ? (
        <Image
          alt={title}
          src={src}
          fill
          sizes="(max-width: 639px) 50vw, (min-width: 640px) 33.33vw, (min-width: 768px) 25vw, (min-width: 1024px) 20vw, (min-width: 1280px) 16.67vw"
          className="object-cover"
          priority={priority}
        />
      ) : (
        <EmptyTile />
      )}
    </div>
  );
}

function EmptyTile() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <ImageIcon className="w-10 opacity-30" />
      <p className="text-xs opacity-30">No image available</p>
    </div>
  );
}
