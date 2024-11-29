import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { WattCopyToClipboardDirective } from './watt-copy-to-clipboard.directive';

describe(WattCopyToClipboardDirective, () => {
  it('shows toast on click', async () => {
    await render(`<span wattCopyToClipboard>Text</span>`, {
      providers: [importProvidersFrom(MatSnackBarModule)],
      imports: [WattCopyToClipboardDirective],
    });

    userEvent.click(screen.getByText('Text'));

    // Clipboard only works in an actual browser
    expect(screen.getByText('Failed to copy')).toBeInTheDocument();
  });
});
