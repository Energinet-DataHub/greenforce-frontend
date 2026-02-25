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
import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { VATER } from '../vater';
import { WATT_CARD } from '../card';
import { WattButtonComponent } from '../button';
import { WattJsonViewer } from './watt-json-viewer.component';

const meta: Meta<WattJsonViewer> = {
  title: 'Components/JsonViewer',
  component: WattJsonViewer,
  decorators: [
    moduleMetadata({
      imports: [VATER, WATT_CARD, WattButtonComponent],
    }),
  ],
};

export default meta;

const exampleJson = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'Energinet DataHub',
  version: 3.14159,
  isActive: true,
  createdAt: '2024-01-15T09:30:00.000Z',
  metadata: null,
  tags: ['energy', 'grid', 'renewable', 'denmark'],
  counts: [1, 2, 3, 5, 8, 13, 21],
  configuration: {
    maxRetries: 3,
    timeoutMs: 5000,
    features: {
      darkMode: true,
      notifications: false,
      experimentalApi: null,
    },
  },
  users: [
    {
      id: 1,
      username: 'alice',
      email: 'alice@example.com',
      roles: ['admin', 'editor'],
    },
    {
      id: 2,
      username: 'bob',
      email: 'bob@example.com',
      roles: ['viewer'],
    },
  ],
  statistics: {
    totalRequests: 1048576,
    averageResponseTime: 42.5,
    errorRate: 0.0023,
    uptime: 99.99,
  },
  emptyObject: {},
  emptyArray: [],
  invalidJson: {
    undefined: undefined,
    function: () => console.log('this is invalid JSON'),
  },
  circularRef: null as unknown,
  negativeNumber: -10.2,
  scientificNotataion: -53.2e64,
  specialCharacters: 'Line 1\nLine 2\tTabbed"Escaped Quote',
  unicodeText: 'Æblegrød med fløde 🍏',
  longText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
};

exampleJson.circularRef = exampleJson;

export const Overview: StoryFn<WattJsonViewer> = () => ({
  props: { json: exampleJson },
  template: `
    <vater-flex inset="m" align="end" gap="m">
      <vater-stack direction="row" gap="s">
        <watt-button (click)="viewer.expandAll()">Expand all</watt-button>
        <watt-button (click)="viewer.collapseAll()">Collapse all</watt-button>
      </vater-stack>
      <watt-card vater fill="both" scrollable>
        <watt-json-viewer #viewer [json]="json" [maxDepth]="5" />
      </watt-card>
    </vater-flex>
  `,
});
