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
import { describe, it, expect } from 'vitest';

import { ChangeCustomerCharacteristicsBusinessReason } from '@energinet-datahub/dh/shared/domain/graphql';

import {
  getCustomerPrefillSource,
  resolveCustomerPrefillValue,
  shouldMaskCustomerCprFields,
} from './customer-prefill-source';

const { ChangeOfEnergySupplier, CustomerMoveIn, SecondaryMoveIn, UpdateMasterDataConsumer } =
  ChangeCustomerCharacteristicsBusinessReason;

describe('getCustomerPrefillSource', () => {
  describe('returns temporary-storage for move-in processes (BRS-009)', () => {
    it('CustomerMoveIn', () => {
      expect(getCustomerPrefillSource(CustomerMoveIn)).toBe('temporary-storage');
    });

    it('SecondaryMoveIn', () => {
      expect(getCustomerPrefillSource(SecondaryMoveIn)).toBe('temporary-storage');
    });
  });

  describe('returns metering-point customer identification for change of supplier', () => {
    it('ChangeOfEnergySupplier (BRS-001)', () => {
      expect(getCustomerPrefillSource(ChangeOfEnergySupplier)).toBe(
        'metering-point-customer-identification'
      );
    });
  });

  describe('returns metering-point for processes that read existing data', () => {
    it('UpdateMasterDataConsumer (BRS-015)', () => {
      expect(getCustomerPrefillSource(UpdateMasterDataConsumer)).toBe('metering-point');
    });
  });

  describe('fallback', () => {
    it('returns metering-point when reason is undefined', () => {
      expect(getCustomerPrefillSource(undefined)).toBe('metering-point');
    });

    it('returns metering-point for an unregistered BRS reason', () => {
      const unknownReason = 'SomeNewReason' as ChangeCustomerCharacteristicsBusinessReason;
      expect(getCustomerPrefillSource(unknownReason)).toBe('metering-point');
    });
  });
});

describe('shouldMaskCustomerCprFields', () => {
  it('returns true for the Update Customer Data process itself', () => {
    expect(shouldMaskCustomerCprFields(UpdateMasterDataConsumer)).toBe(true);
  });

  it.each([ChangeOfEnergySupplier, CustomerMoveIn, SecondaryMoveIn, undefined])(
    'returns false for other process contexts (%s)',
    (reason) => {
      expect(shouldMaskCustomerCprFields(reason)).toBe(false);
    }
  );
});

describe('resolveCustomerPrefillValue', () => {
  it('does not fall back to metering point data when temporary storage is the source', () => {
    expect(
      resolveCustomerPrefillValue({
        source: 'temporary-storage',
        temporaryStorageValue: null,
        meteringPointValue: 'Metering point customer',
        temporaryStorageLoading: false,
      })
    ).toBe('');
  });

  it('returns an empty value while temporary storage is loading', () => {
    expect(
      resolveCustomerPrefillValue({
        source: 'temporary-storage',
        temporaryStorageValue: 'Temporary storage customer',
        meteringPointValue: 'Metering point customer',
        temporaryStorageLoading: true,
      })
    ).toBe('');
  });

  it('uses metering point data for metering-point prefill sources', () => {
    expect(
      resolveCustomerPrefillValue({
        source: 'metering-point',
        temporaryStorageValue: 'Temporary storage customer',
        meteringPointValue: 'Metering point customer',
        temporaryStorageLoading: false,
      })
    ).toBe('Metering point customer');
  });
});
