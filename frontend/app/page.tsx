'use client';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { createList } from '@/actions/create-list';
import { deleteList } from '@/actions/delete-list';
import { getLists } from '@/actions/get-lists';
import { Close, /* Edit,*/ Question } from '@/components/icons';
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { List } from '@/lib/types';
const columns = [
  { canonical: `name`, display: `List Name` },
  { canonical: `creator`, display: `Creator` },
  { canonical: `actions`, display: `` },
];
export default function Home() {
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState<string>(``);
  useEffect(() => {
    void getLists().then((data) => setLists(data));
  }, []);

  return (
    <section className='container mx-auto flex flex-col items-center justify-start gap-4'>
      <div className='flex w-full items-center justify-end gap-4'>
        <input
          className='rounded-sm border px-4 py-2'
          onChange={(input) => {
            setNewListName(input.currentTarget.value);
          }}
          onKeyDown={async (e) => {
            if (e.key !== `Enter`) return;
            if (newListName === ``) {
              alert(`Please name your list`);
              return;
            }

            const newList = await createList({ name: newListName });

            if (!newList) {
              alert(`list already exists`);
              return;
            }

            if (newList.type === `error`) {
              alert(`cooked`);
              return;
            }

            setLists((curLists) => [
              ...curLists,
              { creator: `me`, id: newList.id, name: newListName },
            ]);

            setNewListName(``);
          }}
          onSubmit={(e) => e.preventDefault()}
          placeholder="The list's name"
          value={newListName}
        />
        <button
          className='h-min rounded-sm border bg-white px-4 py-2 text-black transition-colors hover:cursor-pointer hover:bg-accent/80'
          onClick={async () => {
            if (newListName === ``) {
              alert(`Please name your list`);
              return;
            }

            const newList = await createList({ name: newListName });

            if (!newList) {
              alert(`list already exists`);
              return;
            }

            if (newList.type === `error`) {
              alert(`cooked`);
              return;
            }

            setLists((curLists) => [
              ...curLists,
              { creator: `me`, id: newList.id, name: newListName },
            ]);

            setNewListName(``);
          }}
        >
          Create List
        </button>
      </div>
      <Lists lists={lists} setLists={setLists} />
    </section>
  );
}

const Lists = ({
  lists,
  setLists,
}: {
  lists: List[];
  setLists: Dispatch<SetStateAction<List[]>>;
}) => (
  <Table className='w-full'>
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableHeader
            className='h-10 px-6 py-3 text-left align-middle text-xs font-semibold whitespace-nowrap'
            key={column.canonical}
          >
            {column.display}
          </TableHeader>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {lists.map((list) => (
        <ListRow key={list.id} list={list} setLists={setLists} />
      ))}
    </TableBody>
  </Table>
);

const ListRow = ({
  list,
  setLists,
}: {
  list: List;
  setLists: Dispatch<SetStateAction<List[]>>;
}) => {
  const router = useRouter();
  const [childHovered, setChildHovered] = useState(false); // cooked
  const [confirmed, setConfirmed] = useState(false); // cooked

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

  console.log(list.id);
  return (
    <TableRow
      className={clsx(
        `transition-colors not-last:border-b first:border-t`,
        !childHovered && `hover:cursor-pointer hover:bg-accent/20`,
      )}
      onClick={() => {
        router.push(`/lists/${list.id}`);
      }}
    >
      <TableData>{list.name}</TableData>
      <TableData>{list.creator}</TableData>
      <TableData className='flex justify-end gap-2 p-3!'>
        <button
          className='inline-flex size-9 items-center justify-center rounded-sm border bg-destructive text-white transition-colors hover:cursor-pointer hover:bg-destructive/70'
          onClick={async (e) => {
            e.stopPropagation();

            if (!confirmed) {
              setConfirmed(true);
              return;
            }

            if (!(await deleteList(list.id))) {
              alert(`failed to delete list.`);
              return;
            }

            setLists((lists) =>
              lists.filter((searchedList) => searchedList.id !== list.id),
            );
          }}
          onMouseEnter={() => setChildHovered(true)}
          onMouseLeave={() => setChildHovered(false)}
        >
          {confirmed ?
            <Question />
          : <Close />}
        </button>
      </TableData>
    </TableRow>
  );
};
