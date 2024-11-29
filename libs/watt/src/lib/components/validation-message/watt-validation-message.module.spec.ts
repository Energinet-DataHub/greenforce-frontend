import { render } from '@testing-library/angular';

import {
  WattValidationMessageComponent,
  WattValidationMessageType,
} from './watt-validation-message.component';

describe(WattValidationMessageComponent, () => {
  it('exports shared Watt Design System validation message', async () => {
    const label = 'Error';
    const message = 'The metering point is not active';
    const type: WattValidationMessageType = 'danger';

    const view = await render(
      `
      <watt-validation-message label="${label}" message="${message}" type="${type}">
      </watt-validation-message>
    `,
      {
        imports: [WattValidationMessageComponent],
      }
    );

    expect(view.queryByText(label)).not.toBeNull();
    expect(view.queryByText(message)).not.toBeNull();
  });
});
