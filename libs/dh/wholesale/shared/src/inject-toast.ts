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
