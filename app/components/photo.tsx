'use client';

import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';

export function Photo({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative w-full h-full">
      {src ? (
        <Image
          id="img"
          alt={title}
          src={src}
          width="200"
          height="200"
          className="absolute inset-0 object-cover w-full h-full rounded-lg shadow-sm"
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
      <PhotoIcon className="w-10 opacity-30" />
      <p className="text-xs opacity-30">No image available</p>
    </div>
  );
}
