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
import { ActorStatus, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhActor } from '@energinet-datahub/dh/market-participant/actors/domain';
import { AllFiltersCombined } from './actors-filters';
import { dhActorsCustomFilterPredicate } from './dh-actors-custom-filter-predicate';
import { dhToJSON } from './dh-json-util';

function createActor({
  status,
  marketRole,
  glnOrEicNumber = '1234567890123',
  name = 'Test',
}: {
  status: Pick<DhActor, 'status'>['status'];
  marketRole: Pick<DhActor, 'marketRole'>['marketRole'];
  glnOrEicNumber?: Pick<DhActor, 'glnOrEicNumber'>['glnOrEicNumber'];
  name?: Pick<DhActor, 'name'>['name'];
}): DhActor {
  return {
    glnOrEicNumber,
    name,
    marketRole,
    status,
  } as DhActor;
}

describe(dhActorsCustomFilterPredicate.name, () => {
  it('return a function', () => {
    expect(dhActorsCustomFilterPredicate).toBeInstanceOf(Function);
  });

  describe('when the function is called', () => {
    it('return true if all filters are at their initial state', () => {
      const actor = createActor({ status: ActorStatus.Active, marketRole: null });

      const filters: AllFiltersCombined = {
        actorStatus: null,
        marketRoles: null,
        searchInput: '',
      };

      expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(true);
    });

    describe('when the status filter is set', () => {
      it('return true if the actor status is found in the filter', () => {
        const actor = createActor({
          status: ActorStatus.Active,
          marketRole: EicFunction.BalanceResponsibleParty,
        });

        const filters: AllFiltersCombined = {
          actorStatus: [ActorStatus.Active, ActorStatus.Inactive],
          marketRoles: null,
          searchInput: '',
        };

        expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(true);
      });

      it('return false if the actor status is NOT found the filter', () => {
        const actor = createActor({
          status: ActorStatus.Active,
          marketRole: EicFunction.BalanceResponsibleParty,
        });

        const filters: AllFiltersCombined = {
          actorStatus: [ActorStatus.Inactive],
          marketRoles: null,
          searchInput: '',
        };

        expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(false);
      });
    });

    describe('when the market role filter is set', () => {
      it('return true if the actor market role is found in the filter', () => {
        const actor = createActor({
          status: ActorStatus.Active,
          marketRole: EicFunction.BalanceResponsibleParty,
        });

        const filters: AllFiltersCombined = {
          actorStatus: null,
          marketRoles: [EicFunction.BalanceResponsibleParty, EicFunction.DanishEnergyAgency],
          searchInput: '',
        };

        expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(true);
      });

      it('return false if the actor market role is not found the filter', () => {
        const actor = createActor({
          status: ActorStatus.Active,
          marketRole: EicFunction.BalanceResponsibleParty,
        });

        const filters: AllFiltersCombined = {
          actorStatus: null,
          marketRoles: [EicFunction.DanishEnergyAgency, EicFunction.EnergySupplier],
          searchInput: '',
        };

        expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(false);
      });

      it('return false if the actor market role is null', () => {
        const actor = createActor({
          status: ActorStatus.Active,
          marketRole: null,
        });

        const filters: AllFiltersCombined = {
          actorStatus: null,
          marketRoles: [EicFunction.DanishEnergyAgency],
          searchInput: '',
        };

        expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(false);
      });
    });

    describe('when the search input filter is set', () => {
      describe('search in actor name', () => {
        const actor = createActor({
          name: 'DataHub Test',
          status: ActorStatus.Active,
          marketRole: EicFunction.BalanceResponsibleParty,
        });

        it('return true if input value is found', () => {
          const filters: AllFiltersCombined = {
            actorStatus: null,
            marketRoles: null,
            searchInput: 'DataHub',
          };

          expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(true);
        });

        it('return false if input value is NOT found', () => {
          const filters: AllFiltersCombined = {
            actorStatus: null,
            marketRoles: null,
            searchInput: 'NOT datahub',
          };

          expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(false);
        });
      });

      describe('search in actor glnOrEicNumber', () => {
        const actor = createActor({
          glnOrEicNumber: '0000000000001',
          status: ActorStatus.Active,
          marketRole: EicFunction.BalanceResponsibleParty,
        });

        it('return true if input value is found', () => {
          const filters: AllFiltersCombined = {
            actorStatus: null,
            marketRoles: null,
            searchInput: '1',
          };

          expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(true);
        });

        it('return false if input value is NOT found', () => {
          const filters: AllFiltersCombined = {
            actorStatus: null,
            marketRoles: null,
            searchInput: '2',
          };

          expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(false);
        });
      });
    });

    describe('when all filters are set', () => {
      const actor = createActor({
        name: 'DataHub Test',
        status: ActorStatus.Active,
        marketRole: EicFunction.BalanceResponsibleParty,
      });

      it('return true if actor matches all filters', () => {
        const filters: AllFiltersCombined = {
          actorStatus: [ActorStatus.Active],
          marketRoles: [EicFunction.BalanceResponsibleParty],
          searchInput: 'DataHub',
        };

        expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(true);
      });

      it('return false if actor partially matches filters', () => {
        const filters: AllFiltersCombined = {
          actorStatus: [ActorStatus.Inactive],
          marketRoles: [EicFunction.BalanceResponsibleParty],
          searchInput: 'DataHub',
        };

        expect(dhActorsCustomFilterPredicate(actor, dhToJSON(filters))).toBe(false);
      });
    });
  });
});
