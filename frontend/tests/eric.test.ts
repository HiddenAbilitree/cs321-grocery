import { and, eq } from 'drizzle-orm';
import assert from 'node:assert';
import { describe, expect, it } from 'vitest';

import { addItem } from '@/actions/add-item-to-list';
import { createList } from '@/actions/create-list';
import { deleteItem } from '@/actions/delete-item-from-list';
import { getList } from '@/actions/get-list';
import { db } from '@/db';
import { listsTable } from '@/db/schema';

describe(`individual list behavior should work properly`, () => {
  it(`should show the list information`, async () => {
    await db
      .delete(listsTable)
      .where(
        and(
          eq(listsTable.name, `test list`),
          eq(listsTable.creator, `someone`),
        ),
      );

    const res = await createList({
      creator: `someone`,
      name: `test list`,
    });

    expect(res).toBeDefined();
    assert.ok(res);
    expect(res.type).toBe(`success`);
    assert.ok(res.type === `success`);

    const list = await getList(res.id);

    expect(list).toBeDefined();
    assert.ok(list);

    expect(list.name).toBe(`test list`);
    expect(list.creator).toBe(`someone`);
    expect(list.items.length).toBe(0);
  });

  it(`should add an item`, async () => {
    await db
      .delete(listsTable)
      .where(
        and(
          eq(listsTable.name, `test list`),
          eq(listsTable.creator, `someone`),
        ),
      );
    const list = await createList({ creator: `someone`, name: `test list` });

    expect(list).toBeDefined();
    assert.ok(list);
    expect(list.type).toBe(`success`);
    assert.ok(list.type === `success`);

    const { id } = list;

    const itemId = await addItem({
      item: { count: 5, from: `walmart`, name: `Test item`, price: 20 },
      listId: id,
    });

    expect(itemId).toBeDefined();
    assert.ok(itemId);
  });

  it(`should delete an item`, async () => {
    await db
      .delete(listsTable)
      .where(
        and(
          eq(listsTable.name, `test list`),
          eq(listsTable.creator, `someone`),
        ),
      );

    const list = await createList({ creator: `someone`, name: `test list` });

    assert.ok(list);
    assert.ok(list.type === `success`);

    const { id } = list;

    const itemId = await addItem({
      item: { count: 5, from: `walmart`, name: `Test item`, price: 20 },
      listId: id,
    });

    assert.ok(itemId);

    const deletedItems = await deleteItem({ itemId, listId: id });
    expect(deletedItems[0]).toMatchObject({
      count: 5,
      item_id: itemId,
      list_id: id,
    });
  });
});
