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
import { FormGroup } from '@angular/forms';
import dayjs from 'dayjs';
import { DocumentType, BusinessReason } from '@energinet-datahub/dh/shared/domain/graphql';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';

const documentTypes = dhMakeFormControl<DocumentType[]>();
const businessReasons = dhMakeFormControl<BusinessReason[]>();
const senderNumber = dhMakeFormControl<string>();
const receiverNumber = dhMakeFormControl<string>();
const start = dhMakeFormControl(dayjs().startOf('day').toDate());
const end = dhMakeFormControl(dayjs().endOf('day').toDate());

export const form = new FormGroup({
  documentTypes,
  businessReasons,
  senderNumber,
  receiverNumber,
  start,
  end,
});

export type FormValues = ReturnType<typeof form.getRawValue>;
