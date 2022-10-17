import { ToLowerSort } from './dh-table-sort';

describe('ToLowerSort', () => {
  it('Should to lower case the selected property', () => {
    // Arrange
    const array = { headerName: 'Header Name', body: 'Body' };
    const expected = 'header name';

    // Act
    const actual = ToLowerSort().call(this, array, 'headerName');

    // Assert
    expect(actual).toBe(expected);
  });
});
