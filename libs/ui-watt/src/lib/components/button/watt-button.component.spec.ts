/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { Injector, Type } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { WattLinkButtonComponent } from './link-button/watt-link-button.component';
import { WattButtonType } from './watt-button-type';
import { WattButtonComponent } from './watt-button.component';
import { WattPrimaryButtonComponent } from './primary-button/watt-primary-button.component';
import { WattPrimaryLinkButtonComponent } from './primary-link-button/watt-primary-link-button.component';
import { WattSecondaryButtonComponent } from './secondary-button/watt-secondary-button.component';
import { WattSecondaryLinkButtonComponent } from './secondary-link-button/watt-secondary-link-button.component';
import { WattTextButtonComponent } from './text-button/watt-text-button.component';

const appInjector = TestBed.inject(Injector);

describe(WattButtonComponent.name, () => {
  function createComponent({
    type = 'text',
    withLink = false,
  }: {
    type?: WattButtonType;
    withLink?: boolean;
  } = {}): WattButtonComponent {
    const component: WattButtonComponent = (() => {
      if (withLink) {
        const routerLinkMock = jest.fn() as unknown as RouterLink;

        return new WattButtonComponent(appInjector, routerLinkMock);
      } else {
        return new WattButtonComponent(appInjector);
      }
    })();

    component.type = type;

    return component;
  }
  const buttonComponentTypeAssertions: ReadonlyArray<
    [WattButtonType, Type<unknown>, Type<unknown>]
  > = [
    ['text', WattTextButtonComponent, WattLinkButtonComponent],
    ['primary', WattPrimaryButtonComponent, WattPrimaryLinkButtonComponent],
    [
      'secondary',
      WattSecondaryButtonComponent,
      WattSecondaryLinkButtonComponent,
    ],
  ];

  buttonComponentTypeAssertions.forEach(
    ([buttonType, buttonComponentType, linkButtonComponentType]) => {
      it(`renders a ${buttonType} button`, () => {
        const component = createComponent({
          type: buttonType,
          withLink: false,
        });

        expect(component.buttonComponentType).toEqual(buttonComponentType);
      });

      it(`renders a ${buttonType} button with link`, () => {
        const component = createComponent({ type: buttonType, withLink: true });

        expect(component.buttonComponentType).toEqual(linkButtonComponentType);
      });
    }
  );

  const typeBottomValues = [undefined, null, ''];

  typeBottomValues.forEach((bottomValue) => {
    it(`defaults to a text button (type="${bottomValue}")`, () => {
      const component = new WattButtonComponent(appInjector);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component.type = bottomValue as any;

      expect(component.type).toEqual('text');
    });
  });

  describe('icon', () => {
    it('text button icons have a branded color', () => {
      const component = new WattButtonComponent(appInjector);

      component.type = 'text';

      const hasBrandedColor = component.iconColor === 'primary';
      expect(hasBrandedColor).toEqual(true);
    });

    it('secondary button icons have a branded color', () => {
      const component = new WattButtonComponent(appInjector);

      component.type = 'secondary';

      const hasBrandedColor = component.iconColor === 'primary';
      expect(hasBrandedColor).toEqual(true);
    });

    it('inverts the icon color for the primary button', () => {
      const component = new WattButtonComponent(appInjector);

      component.type = 'primary';

      const hasInvertedIconColor = component.iconColor !== 'primary';
      expect(hasInvertedIconColor).toEqual(true);
    });
  });
});
