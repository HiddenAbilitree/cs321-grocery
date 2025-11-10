'use server';

import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { listsTable } from '@/db/schema';
export const deleteList = async (id: string) => {
  const creator = `me`; // gets user data from their request information ideally, but no auth rn

  const res = await db
    .delete(listsTable)
    .where(and(eq(listsTable.id, id), eq(listsTable.creator, creator)));

  return res.rowCount;
};
