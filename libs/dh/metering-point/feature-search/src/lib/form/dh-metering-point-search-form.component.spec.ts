import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { da } from '@energinet-datahub/dh/globalization/assets-localization';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/globalization/configuration-localization';

import {
  DhMeteringPointSearchFormComponent,
  DhMeteringPointSearchFormScam,
} from './dh-metering-point-search-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe(DhMeteringPointSearchFormComponent.name, () => {
  async function setup() {

    const { fixture } = await render(DhMeteringPointSearchFormComponent, {
      imports: [NoopAnimationsModule, getTranslocoTestingModule(), DhMeteringPointSearchFormScam],
    });

    const submitSpy = jest
      .spyOn(fixture.componentInstance.search, 'emit')
      .mockName('submitSpy');
    const input: HTMLInputElement = screen.getByRole('textbox', {
      name: /search-input/i,
    });

    return {
      input,
      submitSpy,
      fixture
    };
  }

  it('should submit the form', async () => {
    const { submitSpy, input } = await setup();
    const submitButton = screen.getByRole('button', {
      name: da.meteringPoint.search.searchButton,
    });

    userEvent.type(input, 'dsadsad');
    userEvent.click(submitButton);

    expect(input.value).toBe('dsadsad');
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should render input', async () => {
    const { input } = await setup();
    expect(input).toBeInTheDocument();
  });

  it('should render label', async () => {
    await setup();
    const label = screen.getByText(da.meteringPoint.search.searchLabel);
    expect(label).toBeInTheDocument();
  });

  it('should focus the input on load', async () => {
    const { input } = await setup();
    // We check this by attribute, as toHaveFocus is not working unless you do .focus() on the element
    expect(input).toHaveAttribute('autofocus');
  });

  it('should clear search input', async () => {
    const { input } = await setup();

    const clearButton = screen.getByRole('button', {
      name: /clear search input/i,
    });
    expect(clearButton).toBeInTheDocument();

    const value = '23';
    fireEvent.change(input, { target: { value } });
    expect(input.value).toBe(value);

    clearButton.click();
    expect(input.value).toBe('');
  });

  it('should not show errors after clearing search input, but should NOT submit', async () => {
    const { submitSpy, input } = await setup();
    const clearButton = screen.getByRole('button', {
      name: /clear search input/i,
    });
    const submitButton = screen.getByRole('button', {
      name: da.meteringPoint.search.searchButton,
    });

    const value = '23';
    fireEvent.change(input, { target: { value } });
    expect(input.value).toBe(value);

    userEvent.click(clearButton);
    expect(input.value).toBe('');

    fireEvent.blur(input);

    const error = screen.queryByText(da.meteringPoint.search.searchInvalidLength);
    expect(error).not.toBeInTheDocument();

    userEvent.click(submitButton);
    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('should not show errors before input has been blurred', async () => {
    const { input } = await setup();
    expect(screen.queryByText(da.meteringPoint.search.searchInvalidLength)).not.toBeInTheDocument();

    fireEvent.blur(input);

    expect(screen.queryByText(da.meteringPoint.search.searchInvalidLength)).toBeInTheDocument();
  });

  it('should not submit a invalid form', async () => {
    const { submitSpy } = await setup();
    const submitButton = screen.getByRole('button', {
      name: da.meteringPoint.search.searchButton,
    });
    fireEvent.click(submitButton);
    expect(submitSpy).not.toHaveBeenCalled();
  });
});
