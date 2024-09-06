import { inngest } from '../client';
import { processBook, updateThumbhashQuery } from '@/lib/db/seed-thumbhash';
import { sql } from '@/lib/db/drizzle';

export const generateThumbhash = inngest.createFunction(
  {
    id: 'generate-thumbhash',
    concurrency: 10,
    batchEvents: {
      maxSize: 100,
      timeout: '60s',
    },
  },
  { event: 'book.created' },
  async ({ events, step }) => {
    let queryValues = [];

    // Loop over all books in this batch
    for (const event of events) {
      // Fetch the image and generate the thumbhash in a single step
      // Errors will be retried automatically
      // Successful results will be cached if a later step fails
      const result = await step.run('generate-thumbhash', async () => {
        return await processBook(event.data);
      });
      if (result) {
        queryValues.push(result);
      }
    }

    // Build the query
    const queries = queryValues.map((values) => {
      return sql(updateThumbhashQuery, values);
    });

    // Execute the db transaction within a step as it's a side effect
    // and should be retried if it fails, but not re-executed if it succeeds
    await step.run('update-db', async () => {
      return await sql.transaction((tx) => queries);
    });

    return {
      status: 'success',
      message: `Created thumbhashes for ${queryValues.length} out of ${events.length} books`,
    };
  },
);
