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
import { WattToastService } from '@energinet-datahub/watt/toast';
import { MutationStatus } from '@energinet-datahub/dh/shared/util-apollo';
import { TranslocoService } from '@jsverse/transloco';

/** Helper function for displaying a toast message based on MutationStatus. */
export const injectToast = (prefix: string) => {
  const transloco = inject(TranslocoService);
  const toast = inject(WattToastService);
  const t = (key: string) => transloco.translate(`${prefix}.${key}`);
  return (status: MutationStatus) => {
    switch (status) {
      case MutationStatus.Loading:
        return toast.open({ type: 'loading', message: t('loading') });
      case MutationStatus.Error:
        return toast.update({ type: 'danger', message: t('error') });
      case MutationStatus.Resolved:
        return toast.update({ type: 'success', message: t('success') });
    }
  };
};
