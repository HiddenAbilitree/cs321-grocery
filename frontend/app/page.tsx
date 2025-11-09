'use client';

import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import { v4 } from 'uuid';

const columns = [
  { canonical: `name`, display: `List Name` },
  { canonical: `creator`, display: `Creator` },
  { canonical: `actions`, display: `Actions` },
];

type List = {
  creator: string;
  id: string;
  name: string;
};

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState<string>(``);
  return (
    <section className='container mx-auto flex flex-col items-center justify-start gap-4'>
      <div className='full flex w-full items-center justify-end gap-4 px-4 py-4'>
        <input
          className='rounded-sm border bg-background/80 px-4 py-2'
          onChange={(input) => {
            setNewListName(input.currentTarget.value);
          }}
          onSubmit={(e) => e.preventDefault()}
          placeholder="The list's name"
          value={newListName}
        />
        <button
          className='h-min rounded-sm border bg-background px-4 py-2 text-foreground hover:cursor-pointer hover:bg-background/20'
          onClick={() => {
            if (newListName === ``) {
              alert(`Please name your list`);
              return;
            }
            setLists((curLists) => [
              ...curLists,
              { creator: `me`, id: v4(), name: newListName },
            ]);
            setNewListName(``);
          }}
        >
          Create List
        </button>
      </div>
      <table className='max-w-0 min-w-full overflow-x-auto rounded-sm border bg-background'>
        <thead className='border bg-background'>
          <tr className='border-b'>
            {columns.map((column) => (
              <th
                className='h-10 px-6 py-3 text-left align-middle text-xs font-semibold whitespace-nowrap'
                key={column.canonical}
              >
                {column.display}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lists.map((list) => (
            <ListRow key={list.name} list={list} setLists={setLists} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

const ListRow = ({
  list,
  setLists,
}: {
  list: List;
  setLists: Dispatch<SetStateAction<List[]>>;
}) => {
  console.log(list.id);
  return (
    <tr className='border-b transition-colors'>
      {/* {columns.map((column, i) => ( */}
      {/*   <td className='px-6 py-3 align-middle' key={i}> */}
      {/*     {list[column.canonical as keyof typeof list]} */}
      {/*   </td> */}
      {/* ))} */}

      <td className='px-6 py-3 align-middle'>{list.name}</td>
      <td className='px-6 py-3 align-middle'>{list.creator}</td>
      <td className='px-6 py-3 align-middle'>
        <button
          className='px-2 py-2'
          onClick={() => {
            setLists((lists) =>
              lists.filter((searchedList) => searchedList.id !== list.id),
            );
          }}
        >
          x
        </button>
        <Link className='px-2 py-2' href={`/lists/${list.id}`}>
          View
        </Link>
      </td>
    </tr>
  );
};