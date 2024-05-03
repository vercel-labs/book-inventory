"use client";
import { useState } from "react";
import Image from "next/image";
import { BookSkeleton } from "./loading-skeleton";
import { PhotoIcon } from "@heroicons/react/24/outline";

const Tile = ({ src, title }: { src: string; title: string }) => {
  const [isOptimized, setIsOptimized] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="relative w-full h-full">
      {src ? (
        <>
          {isLoading && <BookSkeleton />}
          <Image
            id="img"
            alt={title}
            src={src}
            width="200"
            height="200"
            unoptimized={!isOptimized}
            className="absolute inset-0 object-cover w-full h-full rounded-lg shadow-sm"
            onError={() => {
              setIsOptimized(false);
            }}
            onLoad={() => {
              setIsLoading(false);
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <PhotoIcon className="w-10 opacity-30" />
          <p className="text-xs opacity-30">No image available</p>
        </div>
      )}
    </div>
  );
};

export default Tile;
