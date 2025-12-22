import { CustomerCharacteristicsFormType } from '../types';
import { ChangeCustomerCharacteristicsBusinessReason, ChangeCustomerCharacteristicsInput } from '@energinet-datahub/dh/shared/domain/graphql';
import { FormGroup } from '@angular/forms';

export function mapChangeCustomerCharacteristicsFormToRequest(
  form: FormGroup<CustomerCharacteristicsFormType>,
  meteringPointId: string,
  businessReason: ChangeCustomerCharacteristicsBusinessReason,
  startDate: Date,
  electricalHeating: boolean
): ChangeCustomerCharacteristicsInput {
  // Helper to extract values from FormGroup<FormGroupType>
  function extractGroupValues<T>(
    group: { controls: { [K in keyof T]: { value: T[K] } } } | undefined
  ): T {
    if (!group) return {} as T;
    return Object.keys(group.controls).reduce((acc, key) => {
      acc[key as keyof T] = group.controls[key as keyof T].value;
      return acc;
    }, {} as T);
  }

  // Helper to map address details to UsagePointLocationV1Input
  function mapAddressToUsagePointLocation(
    addressDetails: unknown,
    addressType: 'LEGAL' | 'TECHNICAL'
  ): Record<string, unknown> | undefined {
    if (!addressDetails || typeof addressDetails !== 'object' || !('controls' in addressDetails))
      return undefined;
    const details = addressDetails as { controls: Record<string, { value: unknown }> };
    const addressGroup = (details.controls.addressGroup?.value as Record<string, unknown>) || {};
    return {
      addressType,
      streetName: addressGroup.streetName,
      buildingNumber: addressGroup.buildingNumber,
      floor: addressGroup.floor,
      room: addressGroup.room,
      postCode: addressGroup.postCode,
      cityName: addressGroup.cityName,
      countryCode: addressGroup.countryCode,
      streetCode: addressGroup.streetCode,
      citySubDivisionName: addressGroup.citySubDivisionName,
      postalDistrict: addressGroup.postalDistrict,
      postBox: addressGroup.postBox,
      municipalityCode: addressGroup.municipalityCode,
      darReference: addressGroup.darReference,
      protectedAddress: details.controls.nameAddressProtection?.value ?? false,
    };
  }

  // Map private customer (first and second if present)
  const privateCustomer = extractGroupValues(form.controls.privateCustomerDetails);
  const businessCustomer = extractGroupValues(form.controls.businessCustomerDetails);

  // Map to CustomerInfoV1Input
  const firstCustomer = privateCustomer.customerName1
    ? {
        cvrOrCpr: privateCustomer.cpr1,
        customerName: privateCustomer.customerName1,
        protectedName: false, // Map as needed
      }
    : {
        cvrOrCpr: businessCustomer.cvr,
        customerName: businessCustomer.companyName,
        protectedName: false, // Map as needed
      };

  const secondCustomer = privateCustomer.customerName2
    ? {
        cvrOrCpr: privateCustomer.cpr2,
        customerName: privateCustomer.customerName2,
        protectedName: false, // Map as needed
      }
    : undefined;

  const usagePointLocations = [
    mapAddressToUsagePointLocation(form.controls.legalAddressDetails, 'LEGAL'),
    mapAddressToUsagePointLocation(form.controls.technicalAddressDetails, 'TECHNICAL'),
  ].filter(Boolean);

  return {
    meteringPointId,
    businessReason,
    startDate,
    firstCustomer,
    secondCustomer,
    electricalHeating,
    usagePointLocations,
  } as ChangeCustomerCharacteristicsInput;
}
