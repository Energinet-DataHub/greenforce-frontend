import { OperationVariables } from '@apollo/client/core';

export type SortInput = Record<string, 'ASC' | 'DESC' | null | undefined>;
export type SelectorFn<TResult, TNode> = (data: TResult) => Connection<TNode> | null | undefined;
export type PageInfo = {
  startCursor?: string | null;
  endCursor?: string | null;
};
export type Connection<T> = {
  pageInfo: PageInfo;
  totalCount: number;
  nodes?: T[] | null;
};

export interface ConnectionVariables extends OperationVariables {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
  order?: SortInput | SortInput[] | null;
  filter?: string | null;
}
