export interface SearchParams {
  search?: string;
  yr?: string;
  rtg?: string;
  lng?: string;
  pgs?: string;
  page?: string;
  isbn?: string;
}

export function parseSearchParams(
  params: Record<string, string | string[] | undefined>
): SearchParams {
  return {
    search: typeof params.search === 'string' ? params.search : undefined,
    yr: Array.isArray(params.yr) ? params.yr[0] : params.yr,
    rtg: typeof params.rtg === 'string' ? params.rtg : undefined,
    lng: typeof params.lng === 'string' ? params.lng : undefined,
    pgs: Array.isArray(params.pgs) ? params.pgs[0] : params.pgs,
    page: typeof params.page === 'string' ? params.page : undefined,
    isbn: typeof params.isbn === 'string' ? params.isbn : undefined,
  };
}

export function stringifySearchParams(params: SearchParams): string {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      urlParams.append(key, value);
    }
  });
  return urlParams.toString();
}
