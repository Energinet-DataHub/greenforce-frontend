import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AllFiltersCombined } from './actors-filters';

type ActorOverviewState = {
  filters: AllFiltersCombined;
  actors:
};

export const DhActorOverviewStore = signalStore();
