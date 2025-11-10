'use server';

import { DrizzleQueryError } from 'drizzle-orm';

type List = {
  creator?: string;
  name: string;
};

import { db } from '@/db';
import { listsTable } from '@/db/schema';
import { ListResult } from '@/lib/types';
export const createList = async (
  list: List,
): Promise<ListResult | undefined> => {
  const { creator = `me`, name } = list;

  try {
    const [{ id }] = await db
      .insert(listsTable)
      .values({ creator: creator, name })
      .returning();
    return { id, type: `success` };
  } catch (error) {
    console.error(error);
    return error instanceof DrizzleQueryError ? undefined : { type: `error` };
  }
};
