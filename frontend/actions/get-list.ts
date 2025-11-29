'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { listsTable } from '@/db/schema';
import { ListData } from '@/lib/types';

export const getList = async (id: string): Promise<ListData | undefined> => {
  const res = await db.query.listsTable.findMany({
    where: eq(listsTable.id, id),
    with: {
      listItems: {
        with: { item: true },
      },
    },
  });

  const list = res[0];

  if (!list) return;

  const { id: _id, listItems, ...listData } = list;

  return {
    ...listData,
    items: listItems.map(({ count, item: { from, id, name, price } }) => ({
      count,
      from,
      id,
      name,
      price: price ? Number.parseInt(price) : undefined,
    })),
  };
};
