'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState(``);
  const router = useRouter();
  return (
    <main className='flex grow flex-col items-center justify-center'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col'>
          Your name
          <input
            className='rounded-sm border px-4 py-2'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <button
          className='h-min rounded-sm border bg-white px-4 py-2 text-black transition-colors hover:cursor-pointer hover:bg-accent/80'
          onClick={() => {
            if (name.trim().length === 0) {
              alert(`Please set a name`);
              return;
            }

            localStorage.setItem(`username`, name);
            router.push(`/dashboard`);
          }}
        >
          Enter
        </button>
      </div>
    </main>
  );
}
