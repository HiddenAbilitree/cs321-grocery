import clsx from 'clsx';
import { ComponentProps } from 'react';

const Table = ({ className, ...props }: ComponentProps<`table`>) => (
  <div
    className={clsx(
      className,
      `max-w-0 min-w-full overflow-x-auto rounded-sm border`,
    )}
  >
    <table className='w-full' {...props} />
  </div>
);

const TableHead = ({ className, ...props }: ComponentProps<`thead`>) => (
  <thead className={clsx(className, ``)} {...props} />
);

const TableRow = ({ className, ...props }: ComponentProps<`tr`>) => (
  <tr className={clsx(className, ``)} {...props} />
);

const TableHeader = ({ className, ...props }: ComponentProps<`th`>) => (
  <th
    className={clsx(
      className,
      `h-10 px-6 py-3 text-left align-middle text-xs font-semibold whitespace-nowrap`,
    )}
    {...props}
  />
);

const TableBody = ({ className, ...props }: ComponentProps<`tbody`>) => (
  <tbody className={clsx(className, ``)} {...props} />
);

const TableData = ({ className, ...props }: ComponentProps<`td`>) => (
  <td className={clsx(`px-6 py-3 align-middle`, className)} {...props} />
);

export { Table, TableBody, TableData, TableHead, TableHeader, TableRow };
