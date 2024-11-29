import { Injectable, inject } from '@angular/core';
import {
  ApolloLink,
  Operation,
  FetchResult,
  Observable as LinkObservable,
} from '@apollo/client/core';
import { print } from 'graphql';
import { createClient, Client, Sink } from 'graphql-sse';
import {
  Observable,
  distinctUntilChanged,
  firstValueFrom,
  map,
  shareReplay,
  switchMap,
  timer,
} from 'rxjs';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { DhActorTokenService } from '@energinet-datahub/dh/shared/feature-authorization';

export class SSELink extends ApolloLink {
  constructor(
    private client: Client,
    private notifier: Observable<unknown>
  ) {
    super();
  }

  private fromOperation = (op: Operation) =>
    new Observable((sink: Sink<FetchResult>) =>
      this.client.subscribe({ ...op, query: print(op.query) }, sink)
    );

  public override request = (op: Operation): LinkObservable<FetchResult> =>
    new LinkObservable((subscriber) =>
      this.notifier.pipe(switchMap(() => this.fromOperation(op))).subscribe(subscriber)
    );
}

@Injectable({
  providedIn: 'root',
})
export default class DhSseLink {
  tokenService = inject(DhActorTokenService);

  // Create an observable that attempts to acquire a new token every 30 seconds.
  // Most of the time this results in the same token and no additional requests,
  // since it will be read from cache. But when the token is about to expire,
  // MSAL will intercept the request and a new token will be acquired. This new
  // token is needed since subscriptions cannot have their "Authorization" header
  // updated while they are still subscribed. Subscriptions will unsubscribe and
  // then resubscribe with the new token once the token$ emits.
  token$ = timer(0, 30000).pipe(
    switchMap(() => this.tokenService.acquireToken()),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public create(url: string): SSELink {
    const client = createClient({
      url,
      headers: () =>
        firstValueFrom(this.token$.pipe(map((token) => ({ Authorization: `Bearer ${token}` })))),
    });

    return new SSELink(client, this.token$);
  }
}
