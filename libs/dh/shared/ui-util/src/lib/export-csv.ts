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

export const exportCsv = (headers: string[], lines: string[][]) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(
    new Blob([`\ufeff${headers.join(';')}\n${lines.map((x) => x.join(';')).join('\n')}`], {
      type: 'text/csv;charset=utf-8;',
    })
  );
  a.download = 'result.csv';
  a.click();
};
