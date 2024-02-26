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
type ExportToCSVArgs = {
  headers: string[];
  lines: string[][];
  fileName?: string;
};

export const exportToCSV = ({ headers, lines, fileName = 'result' }: ExportToCSVArgs) => {
  exportToCSVRaw({content: `${headers.join(';')}\n${lines.map((x) => x.join(';')).join('\n')}`, fileName});
};

export const exportToCSVRaw = ({
  content,
  fileName = 'result',
}: {
  content: string;
  fileName: string;
}) => {
  const a = document.createElement('a');

  a.href = URL.createObjectURL(
    new Blob([`\ufeff${content}`], {
      type: 'text/csv;charset=utf-8;',
    })
  );

  a.download = `${fileName}.csv`;
  a.click();
};
