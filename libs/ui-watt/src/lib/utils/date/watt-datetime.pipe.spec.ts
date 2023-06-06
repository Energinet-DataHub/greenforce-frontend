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
import { WattDateTimePipe } from './watt-datetime.pipe';

describe(WattDateTimePipe, () => {
  const pipe = new WattDateTimePipe();

  it('transforms "2015-01-24T03:14:15Z" to "24-01-2015 04:14"', () => {
    expect(pipe.transform('2015-01-24T03:14:15Z')).toBe('24-01-2015 04:14');
  });

  it('transforms "2015-09-21T03:14:15Z" to "21-09-2015 05:14"', () => {
    expect(pipe.transform('2015-09-21T03:14:15Z')).toBe('21-09-2015 05:14');
  });
});
