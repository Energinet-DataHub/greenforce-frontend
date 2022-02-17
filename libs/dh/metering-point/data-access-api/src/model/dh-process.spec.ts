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

import { DHProcess } from './dh-process';
import {
  Process,
  ProcessDetail,
  ProcessDetailError,
} from '@energinet-datahub/dh/shared/data-access-api';

describe(DHProcess.name, () => {
  describe(
    'Testing class method: ' + DHProcess.prototype.hasErrors.name,
    () => {
      let model: DHProcess;

      beforeEach(() => {
        const errors = [] as ProcessDetailError[];
        const details = [{ errors }] as ProcessDetail[];

        model = new DHProcess({ details } as Process);
      });

      it(`should not throw an error if the process detail don't have any errors`, () => {
        expect(model.hasErrors()).toBe(false);
      });

      it(`should not throw an error if the process detail don't have any errors`, () => {
        const error = {
          description: 'Test error',
        } as ProcessDetailError;
        model.details[0].errors = [error];

        expect(model.hasErrors()).toBe(true);
      });
    }
  );
});
