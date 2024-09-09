import { FormGroup } from '@angular/forms';
import dayjs from 'dayjs';
import { DocumentType, BusinessReason } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

const messageId = dhMakeFormControl<string>();
const documentTypes = dhMakeFormControl<DocumentType[]>();
const businessReasons = dhMakeFormControl<BusinessReason[]>();
const senderNumber = dhMakeFormControl<string>();
const receiverNumber = dhMakeFormControl<string>();
const start = dhMakeFormControl(dayjs().startOf('day').toDate());
const end = dhMakeFormControl(dayjs().endOf('day').toDate());
const includeRelated = dhMakeFormControl(false);

export const form = new FormGroup({
  messageId,
  documentTypes,
  businessReasons,
  senderNumber,
  receiverNumber,
  includeRelated,
  start,
  end,
});

export type FormValues = ReturnType<typeof form.getRawValue>;
