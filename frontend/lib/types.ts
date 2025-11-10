type List = {
  creator: string;
  id: string;
  name: string;
};
type ListError = { type: `error` };
type ListResult = ListError | ListSuccess;
type ListSuccess = { id: string; type: `success` };
export type { List, ListResult };
