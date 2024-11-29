import { LocalStorageFake, SessionStorageFake } from '@energinet-datahub/gf/test-util';

import { DhActorStorage } from './dh-actor-storage';

describe(DhActorStorage, () => {
  const actorIds = ['18918674-D8EB-483F-94E8-CE241AB502E5', '898BF589-543C-42DA-8A72-120F0E263E86'];

  test('return selected actor when set', () => {
    // arrange
    const target = new DhActorStorage(new LocalStorageFake(), new SessionStorageFake());

    target.setUserAssociatedActors(actorIds);

    // act
    target.setSelectedActorId(actorIds[1]);
    const actual = target.getSelectedActorId();

    // assert
    expect(actual).toBe(actorIds[1]);
  });

  test('return first actor if no actor is set', () => {
    // arrange
    const target = new DhActorStorage(new LocalStorageFake(), new SessionStorageFake());

    target.setUserAssociatedActors(actorIds);

    // act
    const actual = target.getSelectedActorId();

    // assert
    expect(actual).toBe(actorIds[0]);
  });
});
