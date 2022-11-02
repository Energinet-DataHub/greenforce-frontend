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

export class LocalStorageFake implements Storage {
  [name: string]: any;

  private internalLength = 0;

  public get length() {
    return this.internalLength;
  }

  public readonly setItem = (key: string, value: string) => {
    this[key] = value;
    this.internalLength = Object.keys(this).length;
  };

  public readonly getItem = (key: string) => {
    return this[key];
  };

  public readonly removeItem = (key: string) => {
    delete this[key];
    this.internalLength = Object.keys(this).length;
  };

  public readonly key = (index: number) => {
    return Object.keys(this).at(index) ?? null;
  };

  public readonly clear = () => {
    throw new Error('Method not implemented.');
  };
}
