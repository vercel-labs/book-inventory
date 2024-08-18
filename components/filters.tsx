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
import {
  SearchParams,
  parseSearchParams,
  stringifySearchParams,
} from '@/lib/url-state';

const GENRES = ['Fiction', 'Romance', 'Biography', 'Sci-Fi', 'Non-Fiction'];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'spa', label: 'Spanish' },
  { value: 'ita', label: 'Italian' },
  { value: 'ara', label: 'Arabic' },
  { value: 'fre', label: 'French' },
  { value: 'ger', label: 'German' },
  { value: 'ind', label: 'Indonesian' },
  { value: 'por', label: 'Portuguese' },
];

interface FilterProps {
  searchParams: URLSearchParams;
}

function FilterBase({ searchParams }: FilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialFilters = parseSearchParams(Object.fromEntries(searchParams));
  const [optimisticFilters, setOptimisticFilters] =
    useOptimistic<SearchParams>(initialFilters);

  const updateURL = (newFilters: SearchParams) => {
    const queryString = stringifySearchParams(newFilters);
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const handleFilterChange = (filterType: keyof SearchParams, value: any) => {
    startTransition(() => {
      const newFilters = { ...optimisticFilters, [filterType]: value };
      setOptimisticFilters(newFilters);
      updateURL(newFilters);
    });
  };

  const handleGenreToggle = (genre: string) => {
    startTransition(() => {
      const currentGenres =
        optimisticFilters.search?.split(',').filter(Boolean) || [];
      const newGenres = currentGenres.includes(genre)
        ? currentGenres.filter((g) => g !== genre)
        : [...currentGenres, genre];
      handleFilterChange('search', newGenres.join(','));
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      setOptimisticFilters({});
      router.push('/');
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
              min={1950}
              max={2023}
              step={1}
              value={[Number(optimisticFilters.yr) || 2023]}
              onValueChange={([value]) =>
                handleFilterChange('yr', value.toString())
              }
              className="mt-2"
            />
            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
              <span>1950</span>
              <span>{optimisticFilters.yr || 2023}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="rating">Minimum Rating</Label>
            <Slider
              id="rating"
              min={0}
              max={5}
              step={0.5}
              value={[Number(optimisticFilters.rtg) || 0]}
              onValueChange={([value]) =>
                handleFilterChange('rtg', value.toString())
              }
              className="mt-2"
            />
            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
              <span>0</span>
              <span>{optimisticFilters.rtg || 0} stars</span>
              <span>5</span>
            </div>
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select
              value={optimisticFilters.lng || 'en'}
              onValueChange={(value) => handleFilterChange('lng', value)}
            >
              <SelectTrigger id="language" className="mt-2">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="page-range">Number of Pages</Label>
            <Slider
              id="page-range"
              min={1}
              max={3000}
              step={100}
              value={[Number(optimisticFilters.pgs) || 3000]}
              onValueChange={([value]) =>
                handleFilterChange('pgs', value.toString())
              }
              className="mt-2"
            />
            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
              <span>1</span>
              <span>{optimisticFilters.pgs || 3000}</span>
            </div>
          </div>

          <div>
            <Label>Genres</Label>
            <ScrollArea className="h-[200px] mt-2">
              {GENRES.map((genre) => (
                <div key={genre} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`genre-${genre.toLowerCase()}`}
                    checked={(
                      optimisticFilters.search?.split(',') || []
                    ).includes(genre)}
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

      {Object.keys(optimisticFilters).length > 0 && (
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
