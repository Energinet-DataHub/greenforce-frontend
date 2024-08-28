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
import { BalanceResponsibilityAgreementStatus } from '@energinet-datahub/dh/shared/domain/graphql';

import {
  DhBalanceResponsibleRelation,
  DhBalanceResponsibleRelationFilters,
} from './dh-balance-responsible-relation';
import { dhApplyFilter } from './dh-apply-filter';

const balanceResponsibleGuid = 'balance-responsible-guid';
const energySupplierGuid = 'energy-supplier-guid';

describe(dhApplyFilter, () => {
  const balanceResponsibilityAgreement: DhBalanceResponsibleRelation = {
    status: BalanceResponsibilityAgreementStatus.Active,
    gridArea: {
      code: '888',
    },
    balanceResponsibleWithName: {
      id: balanceResponsibleGuid,
    },
    energySupplierWithName: {
      id: energySupplierGuid,
    },
  } as DhBalanceResponsibleRelation;

  it('should return true when all filters are null', () => {
    // Arrange
    const filters: DhBalanceResponsibleRelationFilters = {
      status: null,
      energySupplierWithNameId: null,
      gridAreaCode: null,
      balanceResponsibleWithNameId: null,
      search: null,
    };

    // Act
    const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

    // Assert
    expect(result).toBe(true);
  });

  describe('status filter', () => {
    it('should return true when the status filter matches', () => {
      // Arrange
      const filters: DhBalanceResponsibleRelationFilters = {
        status: [BalanceResponsibilityAgreementStatus.Active],
        energySupplierWithNameId: null,
        gridAreaCode: null,
        balanceResponsibleWithNameId: null,
        search: null,
      };

      // Act
      const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when the status filter does not match', () => {
      // Arrange
      const filters: DhBalanceResponsibleRelationFilters = {
        status: [BalanceResponsibilityAgreementStatus.Expired],
        energySupplierWithNameId: null,
        gridAreaCode: null,
        balanceResponsibleWithNameId: null,
        search: null,
      };

      // Act
      const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('energy supplier filter', () => {
    it('should return true when the energy supplier filter matches', () => {
      // Arrange
      const filters: DhBalanceResponsibleRelationFilters = {
        status: null,
        energySupplierWithNameId: energySupplierGuid,
        gridAreaCode: null,
        balanceResponsibleWithNameId: null,
        search: null,
      };

      // Act
      const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when the energy supplier filter does not match', () => {
      // Arrange
      const filters: DhBalanceResponsibleRelationFilters = {
        status: null,
        energySupplierWithNameId: 'other-energy-supplier-guid',
        gridAreaCode: null,
        balanceResponsibleWithNameId: null,
        search: null,
      };

      // Act
      const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('grid area filter', () => {
    it('should return true when the grid area filter matches', () => {
      // Arrange
      const filters: DhBalanceResponsibleRelationFilters = {
        status: null,
        energySupplierWithNameId: null,
        gridAreaCode: '888',
        balanceResponsibleWithNameId: null,
        search: null,
      };

      // Act
      const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when the grid area filter does not match', () => {
      // Arrange
      const filters: DhBalanceResponsibleRelationFilters = {
        status: null,
        energySupplierWithNameId: null,
        gridAreaCode: '999',
        balanceResponsibleWithNameId: null,
        search: null,
      };

      // Act
      const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('balance responsible filter', () => {
    it('should return true when the balance responsible filter matches', () => {
      // Arrange
      const filters: DhBalanceResponsibleRelationFilters = {
        status: null,
        energySupplierWithNameId: null,
        gridAreaCode: null,
        balanceResponsibleWithNameId: balanceResponsibleGuid,
        search: null,
      };

      // Act
      const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when the balance responsible filter does not match', () => {
      // Arrange
      const filters: DhBalanceResponsibleRelationFilters = {
        status: null,
        energySupplierWithNameId: null,
        gridAreaCode: null,
        balanceResponsibleWithNameId: 'other-balance-responsible-guid',
        search: null,
      };

      // Act
      const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('combined filters', () => {
    it('should return true when multiple filters match', () => {
      // Arrange
      const filters: DhBalanceResponsibleRelationFilters = {
        status: [BalanceResponsibilityAgreementStatus.Active],
        energySupplierWithNameId: null,
        gridAreaCode: '888',
        balanceResponsibleWithNameId: null,
        search: null,
      };

      // Act
      const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when one filter does not match', () => {
      // Arrange
      const filters: DhBalanceResponsibleRelationFilters = {
        status: [BalanceResponsibilityAgreementStatus.Active],
        energySupplierWithNameId: energySupplierGuid,
        gridAreaCode: '444',
        balanceResponsibleWithNameId: balanceResponsibleGuid,
        search: null,
      };

      // Act
      const result = dhApplyFilter(filters, balanceResponsibilityAgreement);

      // Assert
      expect(result).toBe(false);
    });
  });
});
