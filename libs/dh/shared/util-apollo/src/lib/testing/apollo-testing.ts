//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion
import { Provider } from '@angular/core';
import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  InMemoryCache,
  Observable,
  Operation,
} from '@apollo/client/core';
import { DocumentNode, GraphQLError, print } from 'graphql';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { DhApollo } from '@energinet-datahub/dh/shared/data-access-graphql';

interface PendingOperation {
  operation: Operation;
  observer: ZenObservable.SubscriptionObserver<FetchResult>;
}

/**
 * A test controller for Apollo Client that allows intercepting and responding
 * to GraphQL operations imperatively, similar to ApolloTestingController.
 */
export class ApolloTestingController {
  private pendingOperations: PendingOperation[] = [];

  /**
   * Gets the ApolloLink that should be used with ApolloClient.
   */
  readonly link: ApolloLink = new ApolloLink((operation) => {
    return new Observable((observer) => {
      this.pendingOperations.push({ operation, observer });
    });
  });

  /**
   * Expect that a single operation matching the given document has been made.
   * Returns the operation for further assertions or to flush a response.
   */
  expectOne(document: DocumentNode): TestOperation {
    const expectedQuery = print(document);
    const index = this.pendingOperations.findIndex(
      (pending) => print(pending.operation.query) === expectedQuery
    );

    if (index === -1) {
      const pending = this.pendingOperations.map((p) => p.operation.operationName).join(', ');
      throw new Error(
        'Expected one matching operation for "' +
          this.getOperationName(document) +
          '", ' +
          'found none. Pending operations: [' +
          (pending || 'none') +
          ']'
      );
    }

    const [pendingOp] = this.pendingOperations.splice(index, 1);
    return new TestOperation(pendingOp);
  }

  /**
   * Expect that no operations matching the given document have been made.
   */
  expectNone(document: DocumentNode): void {
    const expectedQuery = print(document);
    const found = this.pendingOperations.find(
      (pending) => print(pending.operation.query) === expectedQuery
    );

    if (found) {
      throw new Error(
        'Expected no matching operations for "' +
          this.getOperationName(document) +
          '", but found one.'
      );
    }
  }

  /**
   * Verify that no unmatched operations are outstanding.
   * Call this in afterEach to ensure all expected operations were handled.
   */
  verify(): void {
    if (this.pendingOperations.length > 0) {
      const pending = this.pendingOperations.map((p) => p.operation.operationName).join(', ');
      throw new Error(this.pendingOperations.length + ' unmatched operation(s): [' + pending + ']');
    }
  }

  private getOperationName(document: DocumentNode): string {
    const def = document.definitions[0];
    if (def.kind === 'OperationDefinition') {
      return def.name?.value ?? 'unnamed';
    }
    return 'unknown';
  }
}

/**
 * Represents a pending GraphQL operation that can be inspected and responded to.
 */
export class TestOperation {
  readonly operation: Operation;
  private observer: ZenObservable.SubscriptionObserver<FetchResult>;

  constructor(pending: PendingOperation) {
    this.operation = pending.operation;
    this.observer = pending.observer;
  }

  /**
   * Flush a successful response for this operation.
   */
  flush(result: { data?: unknown; errors?: GraphQLError[] }): void {
    this.observer.next(result as FetchResult);
    this.observer.complete();
  }

  /**
   * Flush a network error for this operation.
   */
  flushError(error: Error): void {
    this.observer.error(error);
  }
}

/**
 * Creates an ApolloClient configured for testing with the given controller.
 */
export function createTestApolloClient(controller: ApolloTestingController): ApolloClient<unknown> {
  return new ApolloClient({
    link: controller.link,
    cache: new InMemoryCache({ addTypename: false }),
  });
}

/**
 * Creates providers for testing Apollo-based code.
 * Returns the controller for use in tests.
 */
export function setupApolloTesting(): {
  controller: ApolloTestingController;
  providers: Provider[];
} {
  const controller = new ApolloTestingController();
  const client = createTestApolloClient(controller);

  return {
    controller,
    providers: [
      {
        provide: DhApollo,
        useValue: { client },
      },
    ],
  };
}
