import { and, eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import assert from 'node:assert';
import { createList } from '@/actions/create-list';
import { deleteList } from '@/actions/delete-list';
import { db } from '@/db';
import { listsTable } from '@/db/schema';

describe(`group list behavior should work properly`, () => {
  it(`should create the list`, async () => {
  await db
     .delete(listsTable)
     .where(
       and(
         eq(listsTable.creator, `me`),
         eq(listsTable.name, `list1`),
       ),
   );
   const res = await createList({ creator: `me`, name: `list1` });
   expect(res?.type).toBe('success');
});


it(`should not allow a duplicate list`, async () => {
  await db
     .delete(listsTable)
     .where(
       and(
         eq(listsTable.creator, `me`),
         eq(listsTable.name, `list1`),
       ),
   );
   const create_list_test = await createList({ creator: `me`, name: `list1` });
   const duplicate =  await createList({ creator: `me`, name: `list1` });
   expect(create_list_test?.type).toBe('success');
   expect(duplicate).toBeUndefined();
});


it(`should delete an existing list`, async () => {
  await db
     .delete(listsTable)
     .where(
       and(
         eq(listsTable.creator, `me`),
         eq(listsTable.name, `list1`),
       ),
   );
   const create_list_test = await createList({ creator: `me`, name: `list1` });
   expect(create_list_test?.type).toBe('success');

   assert.ok(create_list_test?.type == 'success');
   const id_to_delete = create_list_test.id;

   const delete_test = await deleteList(id_to_delete);
   expect(delete_test).toBe(1);
});


})
