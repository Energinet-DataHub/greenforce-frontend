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
