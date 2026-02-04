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
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { VaterStackComponent } from '@energinet/watt/vater';
import { WattButtonComponent } from '@energinet/watt/button';
import { WattIconComponent } from '@energinet/watt/icon';
import { WattTextAreaFieldComponent } from '@energinet/watt/textarea-field';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'dh-actor-conversation-text-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    VaterStackComponent,
    WattButtonComponent,
    WattIconComponent,
    WattTextAreaFieldComponent,
    TranslocoDirective,
  ],
  template: `
    <vater-stack
      fill="horizontal"
      align="end"
      *transloco="let t; prefix: 'meteringPoint.actorConversation'"
    >
      <watt-textarea-field
        [label]="t('messageLabel')"
        [formControl]="control()"
        [small]="small()"
        data-testid="actor-conversation-message-textarea"
      />
      <watt-button type="submit">
        {{ t('sendButton') }}
        <watt-icon name="send" />
      </watt-button>
    </vater-stack>
  `,
})
export class DhActorConversationTextAreaComponent {
  control = input.required<FormControl<string>>();
  small = input<boolean>(false);
}
