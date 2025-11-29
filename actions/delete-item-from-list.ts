'use server';

import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { listItemsTable } from '@/db/schema';
export const deleteItem = async ({
  itemId,
  listId,
}: {
  itemId: string;
  listId: string;
}) => {
  const res = await db
    .delete(listItemsTable)
    .where(
      and(
        eq(listItemsTable.item_id, itemId),
        eq(listItemsTable.list_id, listId),
      ),
    )
    .returning();

  return res;
};
