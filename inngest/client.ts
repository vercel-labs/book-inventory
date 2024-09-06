import { Inngest, EventSchemas } from 'inngest';
import { type Events } from './events';

export const inngest = new Inngest({
  id: 'book-inventory',
  schemas: new EventSchemas().fromRecord<Events>(),
});
