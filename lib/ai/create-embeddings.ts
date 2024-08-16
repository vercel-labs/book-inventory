import { sql } from 'drizzle-orm';
import { db } from '../db/drizzle';
import { books } from '../db/schema';
import { openai } from '@ai-sdk/openai';
import { embed, generateObject } from 'ai';
import { z } from 'zod';

const embeddingModel = openai.embedding('text-embedding-3-small');
const BATCH_SIZE = 1000;
const CONCURRENCY = 5;

async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });
  return embedding;
}

const bookMetadataSchema = z.object({
  genre: z.string(),
  mood: z.string(),
  themes: z.array(z.string()),
  targetAudience: z.string(),
  writingStyle: z.string(),
});

async function generateBookMetadata(book: typeof books.$inferSelect) {
  const result = await generateObject({
    model: openai('gpt-4o-2024-08-06', {
      structuredOutputs: true,
    }),
    schemaName: 'bookMetadata',
    schemaDescription: 'Information for semantic search',
    schema: bookMetadataSchema,
    prompt: `
      Analyze the following book information and generate metadata:
      Title: ${book.title}
      Description: ${book.description || 'N/A'}
      Average Rating: ${book.average_rating || 'N/A'}
      Popular Shelves: ${JSON.stringify(book.popular_shelves) || 'N/A'}

      Based on this information, provide the metadata as specified in the schema.
    `,
  });

  return result.object;
}

async function processBook(book: typeof books.$inferSelect) {
  try {
    const metadata = await generateBookMetadata(book);

    const embeddingText = `
      Title: ${book.title}
      Description: ${book.description || ''}
      Genre: ${metadata.genre}
      Mood: ${metadata.mood}
      Themes: ${metadata.themes.join(', ')}
      Target Audience: ${metadata.targetAudience}
      Writing Style: ${metadata.writingStyle}
    `.trim();

    const embedding = await generateEmbedding(embeddingText);

    await db
      .update(books)
      .set({
        embedding,
        metadata: JSON.stringify(metadata),
      })
      .where(sql`${books.id} = ${book.id}`);

    console.log(`Updated embedding and metadata for book: ${book.title}`);
  } catch (error) {
    console.error(`Failed to process book: ${book.title}`);
    console.error(error);
  }
}

async function processBookBatch(bookBatch: (typeof books.$inferSelect)[]) {
  const updatePromises = bookBatch.map(processBook);
  await Promise.all(updatePromises);
  console.log(`Updated embeddings for ${bookBatch.length} books`);
}

export async function updateBooksWithEmbeddings() {
  let offset = 0;
  let batchCount = 0;
  let totalProcessed = 0;

  while (true) {
    const batchBooks = await db
      .select()
      .from(books)
      .orderBy(books.id)
      .limit(BATCH_SIZE)
      .offset(offset);

    if (batchBooks.length === 0) break;

    const batchPromises = [];
    for (let i = 0; i < batchBooks.length; i += CONCURRENCY) {
      const concurrentBatch = batchBooks.slice(i, i + CONCURRENCY);
      batchPromises.push(processBookBatch(concurrentBatch));
    }

    await Promise.all(batchPromises);

    offset += BATCH_SIZE;
    batchCount++;
    totalProcessed += batchBooks.length;
    console.log(
      `Processed batch ${batchCount}, Total books processed: ${totalProcessed}`
    );
  }

  console.log(`Finished updating embeddings for ${totalProcessed} books`);
}

updateBooksWithEmbeddings().catch(console.error);
