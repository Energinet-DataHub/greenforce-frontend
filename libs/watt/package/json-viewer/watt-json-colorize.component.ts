import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { Json } from './watt-json-viewer.component';

@Component({
  selector: 'watt-json-colorize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: `
    .watt-json-key {
      color: var(--watt-color-primary);
    }

    .watt-json-string {
      color: var(--watt-color-state-success);
    }

    .watt-json-number {
      color: var(--watt-color-state-warning);
    }

    .watt-json-keyword {
      color: var(--watt-color-state-danger);
    }
  `,
  template: `<span [innerHTML]="colorized()"></span>`,
})
export class WattJsonColorize {
  readonly json = input.required<Json>();
  protected readonly colorized = computed(() => {
    const jsonString = JSON.stringify(this.json(), null, ' ');
    if (jsonString === undefined) {
      return `<span class='watt-json-keyword'>${typeof this.json()}</span>`;
    }
    return jsonString.replace(
      /"([^"]+)":\s|"[^"]*"|\b\d+\.?\d*\b|\b(true|false|null)\b/g,
      (match) => {
        if (match.endsWith(': '))
          return `<span class='watt-json-key'>${match.slice(1, -3)}</span>: `;
        if (match.startsWith('"')) return `<span class='watt-json-string'>${match}</span>`;
        if (/\d/.test(match)) return `<span class='watt-json-number'>${match}</span>`;
        return `<span class='watt-json-keyword'>${match}</span>`;
      }
    );
  });
}
