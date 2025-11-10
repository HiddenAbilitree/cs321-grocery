import {
  numeric,
  pgTable,
  primaryKey,
  smallint,
  text,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const listsTable = pgTable(
  `lists`,
  {
    creator: text().notNull(),
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 32 }).notNull(),
  },
  (table) => [unique().on(table.creator, table.name)],
);

export const listItemsTable = pgTable(
  `list_items`,
  {
    count: smallint().notNull(),
    item_id: uuid()
      .notNull()
      .references(() => itemsTable.id, { onDelete: `cascade` }),
    list_id: uuid().references(() => listsTable.id, { onDelete: `cascade` }),
  },
  (table) => [primaryKey({ columns: [table.item_id, table.list_id] })],
);

export const itemsTable = pgTable(`items`, {
  from: varchar({ length: 32 }).notNull(), // store
  id: uuid().notNull().primaryKey().defaultRandom(),
  name: text().notNull(),
  price: numeric(),
});
