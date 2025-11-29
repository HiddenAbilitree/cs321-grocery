'use server';

import { db } from '@/db';
import { listsTable } from '@/db/schema';
import { List } from '@/lib/types';
export const getLists = async (): Promise<List[]> =>
  await db.select().from(listsTable);
