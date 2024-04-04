import { ApolloLink, Operation, FetchResult, Observable } from '@apollo/client/core';
import { print } from 'graphql';
import { Client } from 'graphql-sse';

export default class SSELink extends ApolloLink {
  constructor(private client: Client) {
    super();
  }

  public override request = (op: Operation): Observable<FetchResult> =>
    new Observable((sink) => this.client.subscribe({ ...op, query: print(op.query) }, sink));
}
