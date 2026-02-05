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
import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { WattCheckboxComponent } from '@energinet/watt/checkbox';
import { WattTooltipDirective } from '@energinet/watt/tooltip';

@Component({
  selector: 'dh-actor-conversation-text-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DhActorConversationTextAreaComponent),
      multi: true,
    },
  ],
  imports: [
    VaterStackComponent,
    WattButtonComponent,
    WattIconComponent,
    WattTextAreaFieldComponent,
    TranslocoDirective,
    ReactiveFormsModule,
    WattCheckboxComponent,
    WattTooltipDirective,
  ],
  styles: `
    .info-icon-color {
      color: var(--watt-color-neutral-black);
    }
  `,
  template: `
    <vater-stack
      fill="horizontal"
      align="end"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <watt-textarea-field
        [label]="t('messageLabel')"
        [formControl]="internalControl"
        [small]="small()"
        (blur)="onTouched()"
        data-testid="actor-conversation-message-textarea"
      />
      <vater-stack direction="row" gap="s">
        <watt-checkbox>
          {{ t('anonymousCheckbox') }}
        </watt-checkbox>
        <watt-icon
          name="info"
          class="info-icon-color"
          [wattTooltip]="t('anonymousTooltip')"
        />
        <watt-button type="submit">
          {{ t('sendButton') }}
          <watt-icon name="send" />
        </watt-button>
      </vater-stack>
    </vater-stack>
  `,
})
export class DhActorConversationTextAreaComponent implements ControlValueAccessor {
  small = input<boolean>(false);

  internalControl = new FormControl<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: (value: string | null) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  constructor() {
    this.internalControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.onChange(value);
    });
  }

  writeValue(value: string | null): void {
    this.internalControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.internalControl.disable({ emitEvent: false });
    } else {
      this.internalControl.enable({ emitEvent: false });
    }
  }
}
