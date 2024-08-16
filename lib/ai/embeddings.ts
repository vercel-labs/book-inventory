import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const embeddingModel = openai.embedding('text-embedding-3-small');

export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  });
  return embedding;
}
