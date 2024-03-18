import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env.d.ts';

export const gql = initGraphQLTada<{
  introspection: introspection;
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
