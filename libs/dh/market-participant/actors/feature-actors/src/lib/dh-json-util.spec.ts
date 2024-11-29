import { dhParseJSON, dhToJSON } from './dh-json-util';

const testObject = { foo: 'bar' };
const testObjectStringified = '{"foo":"bar"}';

describe(dhToJSON, () => {
  it('return a string', () => {
    expect(typeof dhToJSON({})).toBe('string');
  });

  it('return the stringified value', () => {
    expect(dhToJSON(testObject)).toBe(testObjectStringified);
  });
});

describe(dhParseJSON, () => {
  it('return a JSON object', () => {
    expect(dhParseJSON(testObjectStringified)).toBeInstanceOf(Object);
  });

  it('return the parsed value', () => {
    expect(dhParseJSON(testObjectStringified)).toEqual(testObject);
  });

  it('throw an error if the JSON is invalid', () => {
    expect(() => dhParseJSON('normal string')).toThrow('Invalid JSON: normal string');
  });
});
