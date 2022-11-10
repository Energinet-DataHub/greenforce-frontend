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
import { screen } from '@testing-library/angular';

export function getByTerm(term: string) {
  const terms = screen.getAllByRole('term');
  let matches = terms.filter((t: HTMLElement) => t.textContent?.includes(term));

  if (matches.length === 0) {
    matches = screen.getAllByRole('term', { name: term });
  }

  if (matches.length > 1) {
    throwError(`Multiple terms found with text content or name: ${term}`);
  }

  return matches[0];
}

export function queryByTerm(term: string) {
  const terms = screen.queryAllByRole('term');
  let matches = terms.filter((t: HTMLElement) => t.textContent?.includes(term));

  if (matches.length === 0) {
    matches = screen.queryAllByRole('term', { name: term });
  }

  if (matches.length > 1) {
    throwError(`Multiple terms found with text content or name: ${term}`);
  }

  return matches[0] || null;
}

export function getDefinitonByTerm(term: string | HTMLElement) {
  if (typeof term === 'string') {
    term = getByTerm(term);
  }

  const definition = term.nextElementSibling;

  if (!definition) {
    throwError(`No definition found for term: ${term}`);
  } else if (definition.tagName !== 'DD') {
    throwError(`Definition found for term: ${term} is not a definition`);
  }

  return definition;
}

export const getByTitle = (title: string) =>
  screen.queryByTitle(title, { suggest: false });

function throwError(msg: string): void {
  screen.debug();
  throw new Error(msg);
}
