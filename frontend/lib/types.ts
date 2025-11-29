type Item = {
  count: number;
  from: string;
  id: string;
  name: string;
  price: number | undefined;
};
type List = {
  creator: string;
  id: string;
  name: string;
};
type ListData = {
  creator: string;
  items: Item[];
  name: string;
};
type ListError = { type: `error` };
type ListResult = ListError | ListSuccess;

type ListSuccess = { id: string; type: `success` };
export type { Item, List, ListData, ListResult };
