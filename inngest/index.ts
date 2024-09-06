import { type GetEvents } from 'inngest';
import { inngest } from './client';
import { generateThumbhash } from './functions/generateThumbhash';

export { inngest };
export const functions = [generateThumbhash];
export type Events = GetEvents<typeof inngest>;
