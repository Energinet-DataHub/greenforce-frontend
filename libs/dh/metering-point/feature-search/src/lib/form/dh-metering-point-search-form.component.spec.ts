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
import { ActivatedRoute } from '@angular/router';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import userEvent from '@testing-library/user-event';

import {
  validMeteringPointId,
  invalidMeteringPointId,
} from '@energinet-datahub/dh/shared/test-util-metering-point';
import {
  dhMeteringPointPath,
  dhMeteringPointSearchPath,
} from '@energinet-datahub/dh/metering-point/routing';

import { DhMeteringPointSearchComponent } from '../dh-metering-point-search.component';
import {
  DhMeteringPointSearchFormComponent,
  DhMeteringPointSearchFormScam,
} from './dh-metering-point-search-form.component';

describe(DhMeteringPointSearchFormComponent.name, () => {
  async function setup() {
    const { fixture, navigate } = await render(
      DhMeteringPointSearchFormComponent,
      {
        imports: [
          NoopAnimationsModule,
          getTranslocoTestingModule(),
          DhMeteringPointSearchFormScam,
        ],
        routes: [
          {
            path: `${dhMeteringPointPath}/${dhMeteringPointSearchPath}`,
            component: DhMeteringPointSearchComponent,
          },
        ],
      }
    );

    const submitSpy = jest
      .spyOn(fixture.componentInstance.search, 'emit')
      .mockName('submitSpy');

    const input: HTMLInputElement = screen.getByRole('textbox', {
      name: enTranslations.meteringPoint.search.searchLabel,
    });

    const submitButton = screen.getByRole('button', {
      name: enTranslations.meteringPoint.search.searchButton,
    });

    const activatedRoute = TestBed.inject(ActivatedRoute);

    return {
      input,
      submitButton,
      submitSpy,
      fixture,
      navigate,
      activatedRoute,
    };
  }

  it('should render label', async () => {
    await setup();
    const label = screen.getByText(
      enTranslations.meteringPoint.search.searchLabel
    );
    expect(label).toBeInTheDocument();
  });

  it('should focus the input on load', async () => {
    const { input } = await setup();
    expect(input).toHaveFocus();
  });

  it('should clear search input', async () => {
    const { input } = await setup();

    const clearButton = screen.getByTestId('buttonClear');
    expect(clearButton).toBeInTheDocument();

    const value = '23';
    userEvent.type(input, value);
    expect(input.value).toBe(value);

    clearButton.click();
    expect(input.value).toBe('');
  });

  it('should not show errors before input has been blurred', async () => {
    const { input } = await setup();
    expect(
      screen.queryByText(
        enTranslations.meteringPoint.search.searchInvalidLength
      )
    ).not.toBeInTheDocument();

    fireEvent.blur(input);

    expect(
      screen.queryByText(
        enTranslations.meteringPoint.search.searchInvalidLength
      )
    ).toBeInTheDocument();
  });

  describe('on submit', () => {
    it('should submit valid form, and not show error message', async () => {
      const { submitButton, submitSpy, input, activatedRoute } = await setup();
      const errors = screen.queryByText(
        enTranslations.meteringPoint.search.searchInvalidLength
      );

      userEvent.type(input, validMeteringPointId);
      userEvent.click(submitButton);

      expect(input).toBeValid();
      expect(errors).not.toBeInTheDocument();
      expect(submitSpy).toHaveBeenCalled();

      await waitFor(() => {
        expect(activatedRoute.snapshot.queryParams).toEqual({
          q: validMeteringPointId,
        });
      });
    });

    it('should not submit invalid form, but instead show error message and focus input', async () => {
      const { submitButton, submitSpy, input, activatedRoute } = await setup();

      userEvent.type(input, invalidMeteringPointId);
      userEvent.click(submitButton);

      const errors = screen.getByText(
        enTranslations.meteringPoint.search.searchInvalidLength
      );

      expect(input).toBeInvalid();
      expect(input).toHaveFocus();
      expect(errors).toBeInTheDocument();
      expect(submitSpy).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(activatedRoute.snapshot.queryParams).toEqual({
          q: invalidMeteringPointId,
        });
      });
    });
  });

  describe('on deeplink', () => {
    it('should have initial value', async () => {
      const { fixture, input, navigate } = await setup();
      await navigate(
        `${dhMeteringPointPath}/${dhMeteringPointSearchPath}?q=${validMeteringPointId}`
      );

      fixture.componentInstance.ngAfterViewInit();

      const errors = screen.queryByText(
        enTranslations.meteringPoint.search.searchInvalidLength
      );

      expect(input.value).toBe(validMeteringPointId);
      expect(input).toBeValid();
      expect(errors).not.toBeInTheDocument();
    });

    it('should show error message, if initial value is not valid', async () => {
      const { fixture, input, navigate } = await setup();
      await navigate(
        `${dhMeteringPointPath}/${dhMeteringPointSearchPath}?q=${invalidMeteringPointId}`
      );

      fixture.componentInstance.ngAfterViewInit();

      const errors = screen.getByText(
        enTranslations.meteringPoint.search.searchInvalidLength
      );

      expect(errors).toBeInTheDocument();
      expect(input.value).toBe(invalidMeteringPointId);
      expect(input).toBeInvalid();
    });

    it('should not show error message, if initial value is empty', async () => {
      const { fixture, input, navigate } = await setup();
      await navigate(`${dhMeteringPointPath}/${dhMeteringPointSearchPath}`);

      fixture.componentInstance.ngAfterViewInit();

      const errors = screen.queryByText(
        enTranslations.meteringPoint.search.searchInvalidLength
      );

      expect(errors).not.toBeInTheDocument();
      expect(input.value).toBe('');
      expect(input).toBeValid();
    });
  });
});
