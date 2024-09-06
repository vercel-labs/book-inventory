type BookCreated = {
  data: {
    title: string;
    image_url: string | null;
  };
};

export type Events = {
  'book.created': BookCreated;
};
