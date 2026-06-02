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
import { render } from '@testing-library/angular';

import {
  WattFieldErrorComponent,
  WattFieldHintComponent,
  WattFieldWarningComponent,
} from './index';

function expectComponentStyleToContain(cssText: string) {
  expect(
    [...document.head.querySelectorAll('style')].some((style) =>
      style.textContent?.includes(cssText)
    )
  ).toBe(true);
}

function getRenderedElement(container: HTMLElement, selector: string) {
  const element = container.querySelector(selector);

  expect(element).not.toBeNull();

  if (!element) throw new Error(`Could not find ${selector}`);

  return element;
}

describe('Watt field messages', () => {
  it('styles a standalone field error like a field subscript message', async () => {
    const view = await render(`<watt-field-error>Standalone error</watt-field-error>`, {
      imports: [WattFieldErrorComponent],
    });

    const error = getRenderedElement(view.container, 'watt-field-error');
    const style = getComputedStyle(error);

    expect(style.display).toBe('block');
    expect(style.fontSize).toBe('14px');
    expect(style.lineHeight).toBe('20px');
    expect(style.fontWeight).toBe('400');
    expect(style.textTransform).toBe('none');
    expect(style.letterSpacing).toBe('0px');
    expectComponentStyleToContain('color: var(--watt-color-state-danger)');
  });

  it('styles a standalone field warning like a field subscript message', async () => {
    const view = await render(`<watt-field-warning>Standalone warning</watt-field-warning>`, {
      imports: [WattFieldWarningComponent],
    });

    const warning = getRenderedElement(view.container, 'watt-field-warning');
    const style = getComputedStyle(warning);

    expect(style.display).toBe('block');
    expect(style.fontSize).toBe('14px');
    expect(style.lineHeight).toBe('20px');
    expect(style.fontWeight).toBe('400');
    expect(style.textTransform).toBe('none');
    expect(style.letterSpacing).toBe('0px');
    expectComponentStyleToContain('color: var(--watt-color-state-warning)');
  });

  it('styles a standalone field hint like a field subscript message', async () => {
    const view = await render(`<watt-field-hint>Standalone hint</watt-field-hint>`, {
      imports: [WattFieldHintComponent],
    });

    const hint = getRenderedElement(view.container, 'watt-field-hint');
    const style = getComputedStyle(hint);

    expect(style.display).toBe('block');
    expect(style.fontSize).toBe('14px');
    expect(style.lineHeight).toBe('20px');
    expect(style.fontWeight).toBe('400');
    expect(style.textTransform).toBe('none');
    expect(style.letterSpacing).toBe('0px');
    expectComponentStyleToContain('color: var(--watt-color-neutral-grey-700)');
  });
});
