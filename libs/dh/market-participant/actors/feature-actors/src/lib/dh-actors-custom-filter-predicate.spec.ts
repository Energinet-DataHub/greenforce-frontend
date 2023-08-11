import { ActorStatus, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

import { DhActor } from './dh-actor';
import { ActorsFilters } from './actors-filters';
import { dhActorsCustomFilterPredicate } from './dh-actors-custom-filter-predicate';

describe(dhActorsCustomFilterPredicate.name, () => {
  it('return a function', () => {
    expect(dhActorsCustomFilterPredicate()).toBeInstanceOf(Function);
  });

  describe('when the function is called', () => {
    let filterPredicate: ReturnType<typeof dhActorsCustomFilterPredicate>;

    beforeEach(() => {
      filterPredicate = dhActorsCustomFilterPredicate();
    });

    function createActor({
      status,
      marketRole,
    }: {
      status: Pick<DhActor, 'status'>['status'];
      marketRole: Pick<DhActor, 'marketRole'>['marketRole'];
    }): DhActor {
      return {
        marketRole,
        status,
      } as DhActor;
    }

    it('throw an error if the filters are not valid JSON', () => {
      const actor = createActor({ status: null, marketRole: null });

      expect(() => filterPredicate(actor, 'normal string')).toThrow('Invalid filters');
    });

    it('return true if all filters are null', () => {
      const actor = createActor({ status: null, marketRole: null });

      const filters: ActorsFilters = {
        actorStatus: null,
        marketRoles: null,
      };

      expect(filterPredicate(actor, JSON.stringify(filters))).toBe(true);
    });

    describe('when all filters are set', () => {
      it('return false if some actor properties are null', () => {
        let actor = createActor({ status: null, marketRole: EicFunction.BalanceResponsibleParty });

        const filters: ActorsFilters = {
          actorStatus: [ActorStatus.Active],
          marketRoles: [EicFunction.BalanceResponsibleParty],
        };

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(false);

        actor = createActor({ status: ActorStatus.Active, marketRole: null });

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(false);
      });

      it('return true if the actor completely matches the filters', () => {
        const actor = createActor({
          status: ActorStatus.Active,
          marketRole: EicFunction.DanishEnergyAgency,
        });

        const filters: ActorsFilters = {
          actorStatus: [ActorStatus.Active],
          marketRoles: [EicFunction.DanishEnergyAgency],
        };

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(true);
      });

      it('return false if the actor does not completely match the filters', () => {
        let actor = createActor({
          status: ActorStatus.Active,
          marketRole: EicFunction.DanishEnergyAgency,
        });

        const filters: ActorsFilters = {
          actorStatus: [ActorStatus.Active],
          marketRoles: [EicFunction.BalanceResponsibleParty],
        };

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(false);

        actor = createActor({
          status: ActorStatus.Inactive,
          marketRole: EicFunction.BalanceResponsibleParty,
        });

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(false);
      });
    });

    describe('when the status filter is set', () => {
      it('return true if the actor status is found in the filter', () => {
        const actor = createActor({
          status: ActorStatus.Active,
          marketRole: null,
        });

        const filters: ActorsFilters = {
          actorStatus: [ActorStatus.Active, ActorStatus.Inactive],
          marketRoles: null,
        };

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(true);
      });

      it('return false if the actor status is not found the filter', () => {
        const actor = createActor({
          status: ActorStatus.Active,
          marketRole: null,
        });

        const filters: ActorsFilters = {
          actorStatus: [ActorStatus.Inactive],
          marketRoles: null,
        };

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(false);
      });

      it('return false if the actor status is null', () => {
        const actor = createActor({
          status: null,
          marketRole: null,
        });

        const filters: ActorsFilters = {
          actorStatus: [ActorStatus.Inactive],
          marketRoles: null,
        };

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(false);
      });
    });

    describe('when the market role filter is set', () => {
      it('return true if the actor market role is found in the filter', () => {
        const actor = createActor({
          status: null,
          marketRole: EicFunction.BalanceResponsibleParty,
        });

        const filters: ActorsFilters = {
          actorStatus: null,
          marketRoles: [EicFunction.BalanceResponsibleParty, EicFunction.DanishEnergyAgency],
        };

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(true);
      });

      it('return false if the actor market role is not found the filter', () => {
        const actor = createActor({
          status: null,
          marketRole: EicFunction.BalanceResponsibleParty,
        });

        const filters: ActorsFilters = {
          actorStatus: null,
          marketRoles: [EicFunction.DanishEnergyAgency, EicFunction.EnergySupplier],
        };

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(false);
      });

      it('return false if the actor market role is null', () => {
        const actor = createActor({
          status: null,
          marketRole: null,
        });

        const filters: ActorsFilters = {
          actorStatus: null,
          marketRoles: [EicFunction.DanishEnergyAgency],
        };

        expect(filterPredicate(actor, JSON.stringify(filters))).toBe(false);
      });
    });
  });
});
