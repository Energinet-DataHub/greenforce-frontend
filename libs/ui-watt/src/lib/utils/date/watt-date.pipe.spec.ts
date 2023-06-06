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
import { WattDatePipe } from './watt-date.pipe';

describe(WattDatePipe, () => {
  const pipe = new WattDatePipe();

  it('transforms "2021-12-31T23:00:00Z" to "01-01-2022"', () => {
    expect(pipe.transform('2021-12-31T23:00:00Z')).toBe('01-01-2022');
  });

  it('transforms "2021-06-30T22:00:00Z" to "01-07-2021"', () => {
    expect(pipe.transform('2021-06-30T22:00:00Z')).toBe('01-07-2021');
  });
});
