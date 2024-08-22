'use client';

import Image from 'next/image';
import { createPngDataUri } from 'unlazy/thumbhash';

export function Photo({
  src,
  title,
  thumbhash,
}: {
  src: string;
  title: string;
  thumbhash: string;
}) {
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-muted shadow-md">
      <Image
        alt={title}
        src={src}
        blurDataURL={createPngDataUri(thumbhash)}
        placeholder="blur"
        fill
        unoptimized
        className="object-cover"
      />
    </div>
  );
}
