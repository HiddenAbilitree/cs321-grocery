'use server';

import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { listsTable } from '@/db/schema';
export const deleteList = async (id: string) => {
  try {
    const res = await db.delete(listsTable).where(and(eq(listsTable.id, id)));
    return res.rowCount ?? 0;
  } catch {
    return 0;
  }
};
