import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { gql } from 'apollo-angular';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { lazyQuery } from './lazyQuery';
import { GraphQLError } from 'graphql';

const TEST_QUERY = gql`
  query TestQuery($name: String! = "Query") {
    __type(name: $name) {
      name
    }
  }
`;

describe('lazyQuery', () => {
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ApolloTestingModule] });
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => controller.verify());

  it('should not initialize query', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      lazyQuery(TEST_QUERY);
      controller.expectNone(TEST_QUERY);
    })));

  it('should initialize query when called', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = lazyQuery(TEST_QUERY);
      result.query();
      controller.expectOne(TEST_QUERY);
    })));

  it('should trigger onCompleted', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onCompleted = jest.fn();
      const result = lazyQuery(TEST_QUERY, { onCompleted });
      result.query();
      const op = controller.expectOne(TEST_QUERY);
      const data = { __type: { name: 'Query' } };
      op.flush({ data });
      tick();
      expect(onCompleted).toHaveBeenCalledWith(data);
    })));

  it('should trigger onError', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const onError = jest.fn();
      const result = lazyQuery(TEST_QUERY, { onError });
      result.query();
      const op = controller.expectOne(TEST_QUERY);
      op.flush({ errors: [new GraphQLError('TestError')] });
      tick();
      expect(onError).toHaveBeenCalled();
    })));

  it('should override options', fakeAsync(() =>
    TestBed.runInInjectionContext(() => {
      const result = lazyQuery(TEST_QUERY, { variables: { name: 'Query' } });
      result.query({ variables: { name: 'Mutation' } });
      const op = controller.expectOne(TEST_QUERY);
      expect(op.operation.variables['name']).toEqual('Mutation');
    })));
});
