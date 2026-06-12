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
import { inject } from '@angular/core';

import { WattModalService } from '@energinet/watt/modal';

import { DhConfirmActionModal } from '../../components/confirm-action-modal';
import { ProcessActionContext } from '../context';

export type ConfirmActionOptions = {
  translationKey: string;
  onConfirm: (ctx: ProcessActionContext) => void;
};

/**
 * Creates a generic confirm action callback. Must be called within an Angular injection context
 * (e.g. a field initializer of an @Injectable class).
 */
export function confirmAction(options: ConfirmActionOptions) {
  const modalService = inject(WattModalService);
  return (ctx: ProcessActionContext) => {
    modalService.open({
      component: DhConfirmActionModal,
      data: { prefix: options.translationKey },
      onClosed: (confirmed) => {
        if (!confirmed) return;
        options.onConfirm(ctx);
      },
    });
  };
}
