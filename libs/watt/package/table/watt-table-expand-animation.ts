import { afterRenderEffect, computed, ElementRef, linkedSignal, Signal } from '@angular/core';
import { EXPANDABLE_CLASS } from './watt-table.component';

export const animateExpandableCells = (
  elements: Signal<readonly ElementRef<HTMLTableCellElement>[]>,
  trigger: Signal<unknown>
) => {
  const cells = computed(() => elements().map((c) => c.nativeElement));
  const expandable = computed(() => cells().filter((c) => c.classList.contains(EXPANDABLE_CLASS)));
  const deltaY = linkedSignal<number[], number[]>({
    source: computed(() => {
      trigger();
      return expandable().map((cell) => cell.offsetHeight);
    }), // maybe this.animating() source instead
    computation: (_, previous) => {
      return expandable()
        .map((cell) => cell.offsetHeight)
        .map((height, i) => {
          return previous?.source[i] == height ? 0 : height - (previous?.source[i] ?? 0);
        });
    },
  });

  return afterRenderEffect(() => {
    const localCells = cells();
    deltaY().forEach((deltaY, index) => {
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
