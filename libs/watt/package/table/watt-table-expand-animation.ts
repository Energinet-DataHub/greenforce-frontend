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
import { afterRenderEffect, computed, ElementRef, linkedSignal, Signal } from '@angular/core';
import { EXPANDABLE_CLASS } from './watt-table.component';

export const animateExpandableCells = (
  elements: Signal<readonly ElementRef<HTMLTableCellElement>[]>,
  trigger: Signal<unknown>
) => {
  const cells = computed(() => elements().map((c) => c.nativeElement));
  const expandable = computed(() => cells().filter((c) => c.classList.contains(EXPANDABLE_CLASS)));
  const deltaYByIndex = linkedSignal<number[], number[]>({
    source: computed(() => {
      trigger(); // recalculate when cells are expanded
      return expandable().map((cell) => cell.offsetHeight);
    }),
    computation: (_, prev) =>
      expandable()
        .map((cell) => cell.offsetHeight)
        .map((height, i) => height - (prev?.source[i] ?? 0)),
  });

  return afterRenderEffect(() => {
    const localCells = cells();
    deltaYByIndex().forEach((deltaY, index) => {
      if (!deltaY) return;
      const rowIndex = localCells[index].dataset.rowIndex;
      localCells
        .filter((c) => c.dataset.rowIndex! > rowIndex!)
        .forEach((c) => {
          c.animate(
            {
              transform: [`translateY(${deltaY * -1}px)`, 'translateY(0)'],
            },
            {
              duration: 300,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }
          );
        });
    });
  });
};
