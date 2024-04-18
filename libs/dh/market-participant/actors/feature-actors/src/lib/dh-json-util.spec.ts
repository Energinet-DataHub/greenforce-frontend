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
