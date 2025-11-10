'use client';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { createList } from '@/actions/create-list';
import { deleteList } from '@/actions/delete-list';
import { getLists } from '@/actions/get-lists';
import { Close, /* Edit,*/ Question } from '@/components/icons';
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
          className='hover:bg-accent/80 h-min rounded-sm border bg-white px-4 py-2 text-black transition-colors hover:cursor-pointer'
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
  <div className='min-w-full max-w-0 overflow-x-auto rounded-sm border'>
    <table className='w-full'>
      <thead className={clsx(lists.length > 0 && `border-b`)}>
        <tr className=''>
          {columns.map((column) => (
            <th
              className='h-10 whitespace-nowrap px-6 py-3 text-left align-middle text-xs font-semibold'
              key={column.canonical}
            >
              {column.display}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {lists.map((list) => (
          <ListRow key={list.id} list={list} setLists={setLists} />
        ))}
      </tbody>
    </table>
  </div>
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
    <tr
      className={clsx(
        `not-last:border-b transition-colors`,
        !childHovered && `hover:bg-accent/20 hover:cursor-pointer`,
      )}
      onClick={() => {
        router.push(`/lists/${list.id}`);
      }}
    >
      <td className='px-6 py-3 align-middle'>{list.name}</td>
      <td className='px-6 py-3 align-middle'>{list.creator}</td>
      <td className='flex justify-end gap-2 px-3 py-3 align-middle'>
        {/* for changing list name later maybe */}
        {/* <button */}
        {/*   className='hover:bg-accent/50 inline-flex size-9 items-center justify-center rounded-sm border transition-colors hover:cursor-pointer' */}
        {/*   onClick={(e) => { */}
        {/*     e.stopPropagation(); */}
        {/*   }} */}
        {/*   onMouseEnter={() => setChildHovered(true)} */}
        {/*   onMouseLeave={() => setChildHovered(false)} */}
        {/* > */}
        {/*   <Edit className='text-foreground' /> */}
        {/* </button> */}
        <button
          className='bg-destructive hover:bg-destructive/70 inline-flex size-9 items-center justify-center rounded-sm border text-white transition-colors hover:cursor-pointer'
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
      </td>
    </tr>
  );
};
