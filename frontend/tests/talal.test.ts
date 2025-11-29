//Talal's test cases
import { and, eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { createList } from '@/actions/create-list';
import { deleteList } from '@/actions/delete-list';
import { db } from '@/db';
import { listsTable } from '@/db/schema';

describe(`server actions should properly perform their functions`, () => {
  it(`should create the list`, async () => {
    await createList({ creator: `test`, name: `test list` });
    const ret = await db
      .delete(listsTable)
      .where(
        and(eq(listsTable.name, `test list`), eq(listsTable.creator, `test`)),
      );
    expect(ret.rowCount).toBe(1);
  });

  it(`should not create a list with no name`, async () => {
    const ret = await createList({ creator: `test`, name: `` });
    expect(ret?.type).toBe(`error`);
  });
  it(`should not delete any list when deleting nothing`, async () => {
    const ret = await deleteList(``);
    console.log(ret);
    expect(ret).toBe(0);
  });
});
