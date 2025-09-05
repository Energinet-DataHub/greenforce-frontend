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
import {
  afterRenderEffect,
  computed,
  ElementRef,
  linkedSignal,
  Signal,
  untracked,
} from '@angular/core';
import { EXPANDABLE_CLASS } from './watt-table.component';

export const animateExpandableCells = (
  elements: Signal<readonly ElementRef<HTMLTableCellElement>[]>,
  trigger: Signal<unknown>
) => {
  const cells = computed<HTMLTableCellElement[]>(() => elements().map((c) => c.nativeElement));
  const expandable = computed(() => cells().filter((c) => c.classList.contains(EXPANDABLE_CLASS)));

  // Accumulate a map of the height of cells. This needs to remember previous values
  // in case the table navigates/filters or otherwise changes the cells, since cell
  // elements will be added or removed from the list dynamically.
  const heightMap = linkedSignal<Record<string, number>, Record<string, number>>({
    source: computed(() => {
      trigger(); // recalculate when cells are expanded
      return Object.fromEntries(expandable().map((cell) => [cell.dataset.key, cell.offsetHeight]));
    }),
    computation: (source, prev) => ({ ...prev?.value, ...source }),
  });

  // Compute the differences in height for each cell since the last `trigger`
  const deltaMap = linkedSignal<Record<string, number>, [string, number][]>({
    source: heightMap,
    computation: (source, prev) =>
      Object.entries(source).map(([key, height]) => [key, height - (prev?.source[key] ?? 0)]),
  });

  return afterRenderEffect({
    read: () => {
      trigger(); // run the animation in response to the `trigger` signal only
      untracked(() => {
        deltaMap()
          .filter(([, deltaY]) => deltaY !== 0)
          .forEach(([key, deltaY]) => {
            // Animate all cells below the expanding cell
            const rowIndex = cells().find((c) => c.dataset.key === key)?.dataset.rowIndex;
            if (!rowIndex) return;
            cells()
              .filter((c) => c.dataset.rowIndex && c.dataset.rowIndex > rowIndex)
              .forEach((c) => {
                c.animate(
                  { transform: [`translateY(${deltaY * -1}px)`, 'translateY(0)'] },
                  { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', composite: 'add' }
                );
              });
          });
      });
    },
  });
};
