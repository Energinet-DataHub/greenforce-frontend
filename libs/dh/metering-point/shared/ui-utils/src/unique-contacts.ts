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
import type { Contact } from '@energinet-datahub/dh/metering-point/shared/domain';
import { ElectricityMarketViewCustomerRelationType } from '@energinet-datahub/dh/shared/domain/graphql';

export function uniqueContacts(contacts: Contact[]) {
  return contacts
    .reduce((foundValues: Contact[], nextContact) => {
      if (!foundValues.some((contact) => contact.id === nextContact.id)) {
        foundValues.push(nextContact);
      }
      return foundValues;
    }, [])
    .filter(
      (x) =>
        (x.relationType === ElectricityMarketViewCustomerRelationType.Juridical && x.name !== '') ||
        (x.relationType === ElectricityMarketViewCustomerRelationType.Secondary && x.name !== '')
    );
}
