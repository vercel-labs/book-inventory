import fs from 'fs';
import readline from 'readline';
import { NeonQueryFunction } from '@neondatabase/serverless';

export async function saveCheckpoint(
  checkpointFile: string,
  processedLines: number
) {
  await fs.promises.writeFile(
    checkpointFile,
    JSON.stringify({ processedLines }),
    'utf8'
  );
}

export async function loadCheckpoint(checkpointFile: string): Promise<number> {
  try {
    const data = await fs.promises.readFile(checkpointFile, 'utf8');
    return JSON.parse(data).processedLines;
  } catch (error) {
    return 0;
  }
}

export async function processEntities<T>(
  filePath: string,
  checkpointFile: string,
  batchSize: number,
  batchInsertFunction: (
    batch: T[],
    sqlQuery: NeonQueryFunction<false, false>
  ) => Promise<any>,
  sqlQuery: NeonQueryFunction<false, false>,
  totalEntities: number
): Promise<number> {
  const startLine = await loadCheckpoint(checkpointFile);
  let processedLines = startLine;
  let batch: T[] = [];
  const startTime = Date.now();

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (processedLines < startLine) {
      processedLines++;
      continue;
    }

    try {
      const entity = JSON.parse(line) as T;
      batch.push(entity);
      processedLines++;

      if (batch.length >= batchSize) {
        const batchStartTime = Date.now();
        await batchInsertFunction(batch, sqlQuery);
        const batchEndTime = Date.now();
        batch = [];
        await saveCheckpoint(checkpointFile, processedLines);
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const batchSeconds = (batchEndTime - batchStartTime) / 1000;
        const remainingEntities = totalEntities - processedLines;
        const estimatedRemainingSeconds =
          (elapsedSeconds / processedLines) * remainingEntities;
        const progressPercentage = (processedLines / totalEntities) * 100;
        console.log(
          `Processed ${processedLines.toLocaleString()} / ${totalEntities.toLocaleString()} entities (${progressPercentage.toFixed(2)}%). ` +
            `Batch took ${batchSeconds.toFixed(2)}s. ` +
            `Estimated remaining time: ${(estimatedRemainingSeconds / 60).toFixed(2)} minutes`
        );
      }
    } catch (error) {
      console.error('Error processing line:', error);
    }
  }

  if (batch.length > 0) {
    await batchInsertFunction(batch, sqlQuery);
    await saveCheckpoint(checkpointFile, processedLines);
  }

  const totalSeconds = (Date.now() - startTime) / 1000;
  console.log(
    `Total processing time: ${(totalSeconds / 60).toFixed(2)} minutes`
  );

  return processedLines;
}
