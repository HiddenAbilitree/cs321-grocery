'use client';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { Dispatch, SetStateAction, use, useEffect, useState } from 'react';

import type { Item } from '@/lib/types';

import { addItem } from '@/actions/add-item-to-list';
import { deleteItem } from '@/actions/delete-item-from-list';
import { getList } from '@/actions/get-list';
import { Close, Question } from '@/components/icons';
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [items, setItems] = useState<Item[]>([]);
  const [list, setList] = useState<
    undefined | { creator: string; name: string }
  >();

  const [newName, setNewName] = useState(``);
  const [newPrice, setNewPrice] = useState(``);
  const [itemCount, setItemCount] = useState(``);
  const [store, setStore] = useState(``);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    void getList(id).then((data) => {
      if (!data) return;
      setItems(data.items);
      setList({ creator: data.creator, name: data.name });
    });
  }, [id]);

  return (
    <section className='container mx-auto flex flex-col gap-2'>
      <div className='flex'>
        <div>
          <h1 className='text-6xl font-bold text-foreground/80'>
            {list?.name}
          </h1>
          <h2 className='text-3xl font-semibold text-foreground/60'>
            By {list?.creator}
          </h2>
        </div>
        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
          <DialogTrigger className='mt-auto ml-auto h-min rounded-sm border bg-white px-4 py-2 text-black transition-colors hover:cursor-pointer hover:bg-accent/80'>
            Add Item
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className='fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/20'>
              <DialogContent className='flex flex-col gap-2 rounded-md border bg-white p-8 outline-0'>
                <DialogTitle className='text-lg font-semibold'>
                  Add item
                </DialogTitle>
                <hr />
                <div className='flex flex-col gap-8'>
                  <div className='grid grid-cols-2 grid-rows-2 gap-4'>
                    <div className='flex flex-col gap-1'>
                      <label>Name</label>
                      <input
                        className='rounded-sm border px-4 py-2'
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder='name'
                        value={newName}
                      />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label>Price</label>
                      <input
                        className='rounded-sm border px-4 py-2'
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder='price'
                        type='number'
                        value={newPrice}
                      />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label>Count</label>
                      <input
                        className='rounded-sm border px-4 py-2'
                        onChange={(e) => setItemCount(e.target.value)}
                        placeholder='count'
                        type='number'
                        value={itemCount}
                      />
                    </div>
                    <div className='flex flex-col gap-1'>
                      <label>Store</label>
                      <input
                        className='rounded-sm border px-4 py-2'
                        onChange={(e) => setStore(e.target.value)}
                        placeholder='from'
                        value={store}
                      />
                    </div>
                  </div>
                  <button
                    className='h-min rounded-sm border bg-green-500 px-4 py-2 text-black transition-colors hover:cursor-pointer hover:bg-green-400'
                    onClick={async () => {
                      const item = {
                        count: Number.parseInt(itemCount),
                        from: store,
                        name: newName,
                        price: Number.parseInt(newPrice),
                      };

                      const errors = [];

                      if (store.trim().length === 0) {
                        errors.push(`add a store`);
                      }
                      if (newName.trim().length === 0) {
                        errors.push(`set a name`);
                      }
                      if (newPrice.trim().length === 0) {
                        errors.push(`set a price`);
                      }
                      if (itemCount.trim().length === 0) {
                        errors.push(`make sure to set an item count`);
                      }

                      if (errors.length > 0) {
                        alert(errors.join(`\n`));
                        return;
                      }

                      const newItemId = await addItem({
                        item,
                        listId: id,
                      });

                      if (!newItemId) {
                        alert(`Failed to add item to list.`);
                        return;
                      }

                      setItems((items) => [
                        ...items,
                        { ...item, id: newItemId },
                      ]);
                      setStore(``);
                      setNewName(``);
                      setNewPrice(``);
                      setItemCount(``);
                      setDialogOpen(false);
                    }}
                  >
                    Add Item
                  </button>
                </div>
              </DialogContent>
            </DialogOverlay>
          </DialogPortal>
        </Dialog>
      </div>

      <div className='ml-auto flex flex-col gap-2'></div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>#</TableHeader>
            <TableHeader>From</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <ItemRow
              item={item}
              key={item.id}
              listId={id}
              setItems={setItems}
            />
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

const ItemRow = ({
  item,
  listId,
  setItems,
}: {
  item: Item;
  listId: string;
  setItems: Dispatch<SetStateAction<Item[]>>;
}) => {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (confirmed) {
      const timerId = setTimeout(() => {
        setConfirmed(false);
      }, 2500);

      return () => {
        clearTimeout(timerId);
      };
    }
    return;
  }, [confirmed]);

  return (
    <TableRow className={clsx(`not-last:border-b first:border-t`)}>
      <TableData>{item.name}</TableData>
      <TableData>{item.price}</TableData>
      <TableData>{item.count}</TableData>
      <TableData>{item.from}</TableData>
      <TableData className='flex justify-end gap-2 p-3!'>
        <button
          className='inline-flex size-9 items-center justify-center rounded-sm border bg-destructive text-white transition-colors hover:cursor-pointer hover:bg-destructive/70'
          onClick={async (e) => {
            e.stopPropagation();

            if (!confirmed) {
              setConfirmed(true);
              return;
            }

            if (!(await deleteItem({ itemId: item.id, listId }))) {
              alert(`failed to delete list.`);
              return;
            }

            setItems((items) =>
              items.filter((searchedItem) => searchedItem.id !== item.id),
            );
          }}
        >
          {confirmed ?
            <Question />
          : <Close />}
        </button>
      </TableData>
    </TableRow>
  );
};
