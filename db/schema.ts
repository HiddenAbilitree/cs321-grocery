import { relations } from 'drizzle-orm';
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

const listsTable = pgTable(
  `lists`,
  {
    creator: text().notNull(),
    id: uuid().defaultRandom().primaryKey(),
    name: varchar({ length: 32 }).notNull(),
  },
  (table) => [unique().on(table.creator, table.name)],
);

const listItemsTable = pgTable(
  `list_items`,
  {
    count: smallint().notNull(),
    item_id: uuid()
      .notNull()
      .references(() => itemsTable.id, { onDelete: `cascade` }),
    list_id: uuid()
      .notNull()
      .references(() => listsTable.id, { onDelete: `cascade` }),
  },
  (table) => [primaryKey({ columns: [table.item_id, table.list_id] })],
);

const itemsTable = pgTable(`items`, {
  from: varchar({ length: 32 }).notNull(), // store
  id: uuid().notNull().primaryKey().defaultRandom(),
  name: text().notNull(),
  price: numeric(),
});

const listsRelations = relations(listsTable, ({ many }) => ({
  listItems: many(listItemsTable),
}));

const itemsRelations = relations(itemsTable, ({ many }) => ({
  listItems: many(listItemsTable),
}));

const listItemsRelations = relations(listItemsTable, ({ one }) => ({
  item: one(itemsTable, {
    fields: [listItemsTable.item_id],
    references: [itemsTable.id],
  }),
  list: one(listsTable, {
    fields: [listItemsTable.list_id],
    references: [listsTable.id],
  }),
}));

export {
  itemsRelations,
  itemsTable,
  listItemsRelations,
  listItemsTable,
  listsRelations,
  listsTable,
};
