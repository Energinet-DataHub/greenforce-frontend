//#region License
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
//#endregion
interface Options {
  /** The name of the file. */
  name: string;
  /** The MIME type of the file. */
  type: string;
  /** data to be passed to the function. */
  data: unknown;
}

export const toFile = ({ name, type, data }: Options) => {
  const blobPart = data as BlobPart;
  const blob = new Blob([blobPart], { type });
  const basisData = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = basisData;
  link.download = name;
  link.click();
  link.remove();
};
