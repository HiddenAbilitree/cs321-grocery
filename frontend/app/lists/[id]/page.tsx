'use client';
import { use, useEffect, useState } from 'react';

import type { Item, List } from '@/lib/types';

import { getList } from '@/actions/get-list';
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { db } from '@/db';
import { listsTable } from '@/db/schema';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [items, setItems] = useState<Item[]>([]);
  const [list, setList] = useState<
    undefined | { creator: string; name: string }
  >();

  useEffect(() => {
    void getList(id).then((data) => {
      if (!data) return;
      setItems(data.items);
      setList({ creator: data.creator, name: data.name });
    });
  }, [id]);
  return (
    <section className='container mx-auto flex flex-col gap-4'>
      <div className='flex'>
        <div>
          <h1 className='text-6xl font-bold text-foreground/80'>
            {list?.name}
          </h1>
          <h2 className='text-3xl font-semibold text-foreground/60'>
            By {list?.creator}
          </h2>
        </div>
        <div className='ml-auto flex flex-col gap-2'>
          <input
            className='w-min rounded-sm border px-4 py-2'
            placeholder='name'
          />
          <input
            className='w-min rounded-sm border px-4 py-2'
            placeholder='price'
          />
          <input
            className='w-min rounded-sm border px-4 py-2'
            placeholder='count'
          />
          <input
            className='w-min rounded-sm border px-4 py-2'
            placeholder='from'
          />
        </div>
      </div>

      <div className='ml-auto flex flex-col gap-2'></div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>#</TableHeader>
            <TableHeader>From</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableData>{item.name}</TableData>
              <TableData>{item.price}</TableData>
              <TableData>{item.count}</TableData>
              <TableData>{item.from}</TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
