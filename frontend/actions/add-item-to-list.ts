'use server';

import { DrizzleQueryError } from 'drizzle-orm';

import { db } from '@/db';
import { itemsTable, listItemsTable } from '@/db/schema';
export const addItem = async ({
  item: { count, from, name, price },
  listId,
}: {
  item: { count: number; from: string; name: string; price: number };
  listId: string;
}): Promise<string | undefined> => {
  try {
    const res = await db
      .insert(itemsTable)
      .values({ from, name, price: price.toString() })
      .returning();

    const { id } = res[0];

    await db
      .insert(listItemsTable)
      .values({ count, item_id: id, list_id: listId })
      .returning();

    return id;
  } catch (error) {
    return error instanceof DrizzleQueryError ? undefined : { type: `error` };
  }
};
