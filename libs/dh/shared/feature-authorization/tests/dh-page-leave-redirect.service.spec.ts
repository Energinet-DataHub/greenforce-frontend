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
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, PRIMARY_OUTLET } from '@angular/router';

import { DhPageLeaveRedirectService } from '../src/dh-page-leave-redirect.service';

describe(DhPageLeaveRedirectService, () => {
  test('returns parent redirect URL when active leaf has no pageLeaveRedirectUrl', () => {
    // arrange
    const root = createRouteSnapshot({
      children: [
        createRouteSnapshot({
          outlet: PRIMARY_OUTLET,
          data: { pageLeaveRedirectUrl: '/parent' },
          children: [createRouteSnapshot({ outlet: PRIMARY_OUTLET })],
        }),
      ],
    });

    // act
    const target = createTarget(root);
    const actual = target.getRedirectUrl();

    // assert
    expect(actual).toBe('/parent');
  });

  test('traverses the primary outlet route and returns redirect URL from that path', () => {
    // arrange
    const root = createRouteSnapshot({
      children: [
        createRouteSnapshot({
          outlet: 'secondary',
          data: { pageLeaveRedirectUrl: '/ignored-secondary' },
        }),
        createRouteSnapshot({
          outlet: PRIMARY_OUTLET,
          data: { pageLeaveRedirectUrl: '/primary-parent' },
          children: [
            createRouteSnapshot({
              outlet: 'secondary',
              data: { pageLeaveRedirectUrl: '/ignored-child-secondary' },
            }),
            createRouteSnapshot({
              outlet: PRIMARY_OUTLET,
              data: { pageLeaveRedirectUrl: '/primary-leaf' },
            }),
          ],
        }),
      ],
    });

    // act
    const target = createTarget(root);
    const actual = target.getRedirectUrl();

    // assert
    expect(actual).toBe('/primary-leaf');
  });
});

const createTarget = (root: ActivatedRouteSnapshot) => {
  const target = TestBed.runInInjectionContext(() => new DhPageLeaveRedirectService());

  Object.defineProperty(target, 'activatedRoute', {
    value: { snapshot: { root } },
  });

  return target;
};

const createRouteSnapshot = ({
  outlet = PRIMARY_OUTLET,
  data = {},
  children = [],
}: {
  outlet?: string;
  data?: Record<string, unknown>;
  children?: ActivatedRouteSnapshot[];
}): ActivatedRouteSnapshot =>
  ({
    outlet,
    data,
    children,
  }) as ActivatedRouteSnapshot;
