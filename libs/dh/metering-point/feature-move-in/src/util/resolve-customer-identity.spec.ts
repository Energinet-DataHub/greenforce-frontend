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
import { resolveCustomerIdentity, resolveNameProtection } from './resolve-customer-identity';
import { FormValues } from '../types';

function createFormValues(overrides?: Partial<FormValues>): FormValues {
  return {
    businessCustomerDetails: {
      companyName: '',
      cvr: '',
      nameProtection: false,
    },
    privateCustomerDetails: {
      customerName1: '',
      cpr1: null,
      customerName2: '',
      cpr2: null,
      nameProtection: false,
    },
    legalContactDetails: {} as FormValues['legalContactDetails'],
    legalContactAddressDetails: {} as FormValues['legalContactAddressDetails'],
    technicalContactDetails: {} as FormValues['technicalContactDetails'],
    technicalContactAddressDetails: {} as FormValues['technicalContactAddressDetails'],
    ...overrides,
  };
}

describe('resolveCustomerIdentity', () => {
  describe('business customer', () => {
    it('returns company name and CVR', () => {
      const values = createFormValues({
        businessCustomerDetails: {
          companyName: 'Acme Corp',
          cvr: '12345678',
          nameProtection: false,
        },
      });

      const result = resolveCustomerIdentity(values, true);

      expect(result).toEqual({
        firstCustomerName: 'Acme Corp',
        firstCustomerCvr: '12345678',
        firstCustomerCpr: undefined,
        secondCustomerCpr: undefined,
        secondCustomerName: undefined,
      });
    });

    it('converts empty company name to undefined', () => {
      const values = createFormValues({
        businessCustomerDetails: { companyName: '', cvr: '12345678', nameProtection: false },
      });

      const result = resolveCustomerIdentity(values, true);

      expect(result.firstCustomerName).toBeUndefined();
    });

    it('converts empty CVR to undefined', () => {
      const values = createFormValues({
        businessCustomerDetails: { companyName: 'Acme', cvr: '', nameProtection: false },
      });

      const result = resolveCustomerIdentity(values, true);

      expect(result.firstCustomerCvr).toBeUndefined();
    });

    it('never returns CPR fields for business customers', () => {
      const values = createFormValues({
        businessCustomerDetails: { companyName: 'Acme', cvr: '12345678', nameProtection: false },
        privateCustomerDetails: {
          customerName1: 'John',
          cpr1: '1234567890',
          customerName2: 'Jane',
          cpr2: '0987654321',
          nameProtection: false,
        },
      });

      const result = resolveCustomerIdentity(values, true);

      expect(result.firstCustomerCpr).toBeUndefined();
      expect(result.secondCustomerCpr).toBeUndefined();
      expect(result.secondCustomerName).toBeUndefined();
    });
  });

  describe('private customer', () => {
    it('returns names and CPRs', () => {
      const values = createFormValues({
        privateCustomerDetails: {
          customerName1: 'John Doe',
          cpr1: '1234567890',
          customerName2: 'Jane Doe',
          cpr2: '0987654321',
          nameProtection: false,
        },
      });

      const result = resolveCustomerIdentity(values, false);

      expect(result).toEqual({
        firstCustomerName: 'John Doe',
        firstCustomerCpr: '1234567890',
        secondCustomerName: 'Jane Doe',
        secondCustomerCpr: '0987654321',
        firstCustomerCvr: undefined,
      });
    });

    it('converts empty strings to undefined', () => {
      const values = createFormValues({
        privateCustomerDetails: {
          customerName1: '',
          cpr1: '',
          customerName2: '',
          cpr2: '',
          nameProtection: false,
        },
      });

      const result = resolveCustomerIdentity(values, false);

      expect(result.firstCustomerName).toBeUndefined();
      expect(result.firstCustomerCpr).toBeUndefined();
      expect(result.secondCustomerName).toBeUndefined();
      expect(result.secondCustomerCpr).toBeUndefined();
    });

    it('converts null CPR to undefined', () => {
      const values = createFormValues({
        privateCustomerDetails: {
          customerName1: 'John',
          cpr1: null,
          customerName2: '',
          cpr2: null,
          nameProtection: false,
        },
      });

      const result = resolveCustomerIdentity(values, false);

      expect(result.firstCustomerCpr).toBeUndefined();
      expect(result.secondCustomerCpr).toBeUndefined();
    });

    it('never returns CVR for private customers', () => {
      const values = createFormValues({
        businessCustomerDetails: { companyName: 'Acme', cvr: '12345678', nameProtection: false },
      });

      const result = resolveCustomerIdentity(values, false);

      expect(result.firstCustomerCvr).toBeUndefined();
    });
  });
});

describe('resolveNameProtection', () => {
  it('returns business name protection when business customer', () => {
    const values = createFormValues({
      businessCustomerDetails: { companyName: 'Acme', cvr: '123', nameProtection: true },
      privateCustomerDetails: {
        customerName1: 'John',
        cpr1: null,
        customerName2: '',
        cpr2: null,
        nameProtection: false,
      },
    });

    expect(resolveNameProtection(values, true)).toBe(true);
  });

  it('returns private name protection when private customer', () => {
    const values = createFormValues({
      businessCustomerDetails: { companyName: 'Acme', cvr: '123', nameProtection: false },
      privateCustomerDetails: {
        customerName1: 'John',
        cpr1: null,
        customerName2: '',
        cpr2: null,
        nameProtection: true,
      },
    });

    expect(resolveNameProtection(values, false)).toBe(true);
  });
});
