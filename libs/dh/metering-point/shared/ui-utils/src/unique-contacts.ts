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
