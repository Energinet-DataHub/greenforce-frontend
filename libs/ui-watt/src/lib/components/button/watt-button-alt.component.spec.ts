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
import { render, screen } from '@testing-library/angular';
import {
  WattButtonAltOptions,
  WattButtonTypes,
} from './watt-button-alt.component';
import { WattButtonModule } from './watt-button.module';

describe('WattButtonAltComponent', () => {
  const renderComponent = async ({ ...options }: WattButtonAltOptions) => {
    await render(
      `<watt-button-alt
        variant=${options.variant}
        size=${options.size}
        icon=${options.icon}
        [loading]=${options.loading}
        [disabled]=${options.disabled}>
          ${options.text ?? 'Text'}
      </watt-button-alt>`,
      { imports: [WattButtonModule] }
    );
  };

  it('shows text', async () => {
    await renderComponent({ text: 'Text' });

    expect(screen.getByRole('button')).toHaveTextContent('Text');
  });

  it('shows icon', async () => {
    await renderComponent({ icon: 'plus' });

    expect(screen.getByRole('img')).toHaveClass('mat-icon');
  });

  it('shows loading spinner', async () => {
    await renderComponent({ loading: true });

    expect(screen.getByRole('progressbar')).toHaveClass('mat-spinner');
  });

  test.each(WattButtonTypes)(
    'gets variant "%s" applied as class',
    async (variant) => {
      await renderComponent({ variant, text: 'Text' });

      if (variant === 'icon') {
        expect(screen.getByRole('button')).not.toHaveTextContent('Text');
      }
      expect(screen.getByRole('button')).toHaveClass('watt-button--' + variant);
    }
  );

  it('gets size applied as class', async () => {
    await renderComponent({ size: 'large' });

    expect(screen.getByRole('button')).toHaveClass('watt-button--large');
  });

  it('can be disabled', async () => {
    await renderComponent({ disabled: true });

    expect(screen.getByRole('button')).toHaveClass('mat-button-disabled');
  });

  it('is not normally disabled', async () => {
    await renderComponent({ disabled: false });

    expect(screen.getByRole('button')).not.toHaveClass('disabled');
  });

  it('is not normally showing a loading spinner', async () => {
    await renderComponent({ loading: false });

    expect(screen.queryByRole('progressbar')).toBeFalsy();
  });
});
