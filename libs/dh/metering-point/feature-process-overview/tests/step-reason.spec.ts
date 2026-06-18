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
import { render, screen } from '@testing-library/angular';

import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util';

import { DhStepReason } from '../src/components/details/step-reason';

const KNOWN_STEP = 'BRS_011_REQUESTINCORRECTMOVE_V1_STEP_3';
const KNOWN_LABEL = 'Reason for correction';
const UNKNOWN_STEP = 'BRS_999_UNKNOWN_STEP';
const UNKNOWN_KEY = `meteringPoint.processOverview.stepPreviewFieldLabels.${UNKNOWN_STEP}`;

describe('DhStepReason', () => {
  it('renders the label and the comment when a comment is present and a translation exists', async () => {
    await render(DhStepReason, {
      imports: [getTranslocoTestingModule()],
      componentInputs: {
        step: KNOWN_STEP,
        comment: 'Customer cancelled by phone',
      },
    });

    const paragraph = screen.getByRole('paragraph');
    expect(paragraph).toHaveTextContent(KNOWN_LABEL);
    expect(paragraph).toHaveTextContent(/Customer cancelled by phone/);
  });

  it('renders nothing when comment is null', async () => {
    await render(DhStepReason, {
      imports: [getTranslocoTestingModule()],
      componentInputs: {
        step: KNOWN_STEP,
        comment: null,
      },
    });

    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    expect(screen.queryByText(KNOWN_LABEL)).not.toBeInTheDocument();
  });

  it('renders nothing when comment is an empty string', async () => {
    await render(DhStepReason, {
      imports: [getTranslocoTestingModule()],
      componentInputs: {
        step: KNOWN_STEP,
        comment: '',
      },
    });

    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('renders the raw translation key as the label when the translation is missing (frontend opt-in gap)', async () => {
    // Contract: Process Manager owns visibility via ShowPreviewField on the step description.
    // When PM emits a preview field for a step the frontend has not yet added a label for, the
    // raw key surfaces in the UI as a visible bug. This documents that the frontend must add
    // the matching stepPreviewFieldLabels entry whenever PM opts a new step in.
    await render(DhStepReason, {
      imports: [getTranslocoTestingModule()],
      componentInputs: {
        step: UNKNOWN_STEP,
        comment: 'Some comment text',
      },
    });

    const paragraph = screen.getByRole('paragraph');
    expect(paragraph).toHaveTextContent(UNKNOWN_KEY);
    expect(paragraph).toHaveTextContent(/Some comment text/);
  });
});
