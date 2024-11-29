import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';

import { WattSpinnerComponent } from '../spinner';
import { VaterStackComponent } from '../vater';

import { createWorker } from './watt-code.worker-factory';

@Component({
  selector: 'watt-code',
  template: `
    @if (loading()) {
      <vater-stack [fill]="'horizontal'" [align]="'center'"><watt-spinner /></vater-stack>
    } @else {
      <pre>
        <code class="hljs" [innerHTML]="formattedCode()"></code>
      </pre>
    }
  `,
  styleUrls: ['./watt-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [WattSpinnerComponent, VaterStackComponent],
  standalone: true,
})
export class WattCodeComponent implements OnDestroy, OnChanges {
  code = input.required<string | null | undefined>();

  /** @ignore */
  formattedCode = signal<string>('');
  /** @ignore */
  loading = signal<boolean>(false);

  private _worker: Worker = createWorker();

  /** @ignore */
  ngOnDestroy(): void {
    this._worker.terminate();
  }

  /** @ignore */
  ngOnChanges(changes: SimpleChanges): void {
    const { currentValue } = changes['code'];

    if (currentValue === undefined || currentValue === null) {
      this.formattedCode.set('');
      this.loading.set(false);
      return;
    }

    this._worker.onmessage = (event) => {
      this.formattedCode.set(event.data);
      this.loading.set(false);
    };

    this._worker.postMessage(currentValue);
    this.loading.set(true);
  }
}
