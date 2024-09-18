export const make = (pageSize: number, connection) => ({ pageSize, connection });

export const nextPage = ({ pageSize, connection }) => ({
  after: connection.endCursor,
  before: null,
  first: pageSize,
  last: null,
});

export const previousPage = ({ pageSize, connection }) => ({
  after: null,
  before: connection.startCursor,
  first: null,
  last: pageSize,
});

export const firstPage = ({ pageSize }) => ({
  after: null,
  before: null,
  first: pageSize,
  last: null,
});

export const lastPage = ({ pageSize, connection }) => ({
  after: null,
  before: null,
  first: null,
  last: connection.totalCount % pageSize,
});
