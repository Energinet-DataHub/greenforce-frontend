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
import {
  Meta,
  StoryObj,
  applicationConfig,
  moduleMetadata,
  StoryContext,
} from '@storybook/angular';
import { WattDataTableComponent } from './watt-data-table.component';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { Table as TableStory } from '../table/watt-table.stories';
import { WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { VaterStackComponent, VaterUtilityDirective } from '../vater';
import { WattFilterChipComponent } from '../chip';
import { WattDataFiltersComponent } from './watt-data-filters.component';

// Slightly hacky way to get the template from the table story
const tableStoryArgs = TableStory.args ?? {};
const tableStoryTemplate = TableStory(tableStoryArgs, {} as StoryContext).template;

const meta: Meta = {
  title: 'Components/Data Presentation',
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      imports: [
        VaterStackComponent,
        VaterUtilityDirective,
        WattButtonComponent,
        WattFilterChipComponent,
        WattIconComponent,
        WATT_TABLE,
        WattDataTableComponent,
        WattDataFiltersComponent,
      ],
    }),
  ],
};

export default meta;

export const DataTable: StoryObj<WattDataTableComponent> = {
  render: (args) => ({
    props: { ...args, ...tableStoryArgs },
    template: `
      <watt-data-table vater inset="m">
        <h3>Results</h3>
        <watt-button icon="plus" variant="secondary">Add Element</watt-button>
        <watt-data-filters>
          <vater-stack fill="vertical" gap="s" direction="row">
            <watt-filter-chip choice [selected]="true" name="classification">Any Classification</watt-filter-chip>
            <watt-filter-chip choice name="classification">Metals</watt-filter-chip>
            <watt-filter-chip choice name="classification">Non-Metals</watt-filter-chip>
            <watt-filter-chip choice name="classification">Metalloids</watt-filter-chip>
            <watt-filter-chip choice name="classification">Noble Gases</watt-filter-chip>
          </vater-stack>
        </watt-data-filters>
        ${tableStoryTemplate}
      </watt-data-table>
    `,
  }),
};
