'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const GENRES = ['Fiction', 'Romance', 'Biography', 'Sci-Fi', 'Non-Fiction'];

interface FilterProps {
  searchParams: URLSearchParams;
}

function FilterBase({ searchParams }: FilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticFilters, setOptimisticFilters] = useOptimistic({
    yr: [1900, 2023],
    rtg: 0,
    lng: 'en',
    pgs: [0, 1000],
    gnre: [] as string[],
  });

  const updateURL = (newFilters: typeof optimisticFilters) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      newParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => newParams.append(key, v.toString()));
      } else if (value !== 0 && value !== '') {
        newParams.append(key, value.toString());
      }
    });
    router.push(`/?${newParams}`);
  };

  const handleFilterChange = (
    filterType: keyof typeof optimisticFilters,
    value: any
  ) => {
    startTransition(() => {
      const newFilters = { ...optimisticFilters, [filterType]: value };
      setOptimisticFilters(newFilters);
      updateURL(newFilters);
    });
  };

  const handleGenreToggle = (genre: string) => {
    startTransition(() => {
      const newGenres = optimisticFilters.gnre.includes(genre)
        ? optimisticFilters.gnre.filter((g) => g !== genre)
        : [...optimisticFilters.gnre, genre];
      handleFilterChange('gnre', newGenres);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      const defaultFilters = {
        yr: [1900, 2023],
        rtg: 0,
        lng: 'en',
        pgs: [0, 1000],
        gnre: [],
      };
      setOptimisticFilters(defaultFilters);
      updateURL(defaultFilters);
    });
  };

  return (
    <div
      data-pending={isPending ? '' : undefined}
      className="flex-shrink-0 flex flex-col h-full bg-white"
    >
      <ScrollArea className="flex-grow">
        <div className="p-2 space-y-4">
          <div>
            <Label htmlFor="year-range">Publication Year</Label>
            <Slider
              id="year-range"
              min={1800}
              max={2023}
              step={1}
              value={optimisticFilters.yr}
              onValueChange={(value) => handleFilterChange('yr', value)}
              className="mt-2"
            />
            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
              <span>{optimisticFilters.yr[0]}</span>
              <span>{optimisticFilters.yr[1]}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="rating">Minimum Rating</Label>
            <Slider
              id="rating"
              min={0}
              max={5}
              step={0.5}
              value={[optimisticFilters.rtg]}
              onValueChange={([value]) => handleFilterChange('rtg', value)}
              className="mt-2"
            />
            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
              <span>0</span>
              <span>{optimisticFilters.rtg} stars</span>
              <span>5</span>
            </div>
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select
              value={optimisticFilters.lng}
              onValueChange={(value) => handleFilterChange('lng', value)}
            >
              <SelectTrigger id="language" className="mt-2">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="page-range">Number of Pages</Label>
            <Slider
              id="page-range"
              min={0}
              max={1000}
              step={10}
              value={optimisticFilters.pgs}
              onValueChange={(value) => handleFilterChange('pgs', value)}
              className="mt-2"
            />
            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
              <span>{optimisticFilters.pgs[0]}</span>
              <span>{optimisticFilters.pgs[1]}+</span>
            </div>
          </div>

          <div>
            <Label>Genres</Label>
            <ScrollArea className="h-[200px] mt-2">
              {GENRES.map((genre) => (
                <div key={genre} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`genre-${genre.toLowerCase()}`}
                    checked={optimisticFilters.gnre.includes(genre)}
                    onCheckedChange={() => handleGenreToggle(genre)}
                  />
                  <Label htmlFor={`genre-${genre.toLowerCase()}`}>
                    {genre}
                  </Label>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </ScrollArea>

      {Object.values(optimisticFilters).some((v) =>
        Array.isArray(v) ? v.length > 0 : v !== 0
      ) && (
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearFilters}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}

export function FilterFallback() {
  return <FilterBase searchParams={new URLSearchParams()} />;
}

export function Filter() {
  const searchParams = useSearchParams();
  return <FilterBase searchParams={searchParams} />;
}
