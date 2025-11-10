import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { listsTable } from '@/db/schema';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [list] = await db
    .select()
    .from(listsTable)
    .where(eq(listsTable.id, id));
  return (
    <section className='container mx-auto'>
      <h1 className='text-foreground/80 text-6xl font-bold'>{list.name}</h1>
      <h2 className='text-foreground/60 text-3xl font-semibold'>
        By {list.creator}
      </h2>
    </section>
  );
}
