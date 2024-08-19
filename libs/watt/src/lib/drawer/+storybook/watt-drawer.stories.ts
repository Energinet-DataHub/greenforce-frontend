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
import { provideAnimations } from '@angular/platform-browser/animations';
import { moduleMetadata, StoryFn, Meta, applicationConfig } from '@storybook/angular';
import { fireEvent, within } from '@storybook/testing-library';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL } from '../../modal';
import { WATT_DRAWER, WattDrawerComponent } from '../watt-drawer.component';
import { WattStorybookDrawerContentComponent } from './storybook-drawer-content.component';
import { WattStorybookDrawerLoadingComponent } from './storybook-drawer-loading.component';

export default {
  title: 'Components/Drawer',
  component: WattDrawerComponent,
  argTypes: {
    size: { control: false },
    loading: { control: false },
    isOpen: { control: false },
    closed: {
      table: { category: 'Outputs' },
      control: false,
    },
    close: {
      table: { category: 'Methods' },
      control: false,
    },
    open: {
      table: { category: 'Methods' },
      control: false,
    },
  },
  decorators: [
    applicationConfig({
      providers: [provideAnimations()],
    }),
    moduleMetadata({
      imports: [
        WATT_DRAWER,
        WattButtonComponent,
        WATT_MODAL,
        WattStorybookDrawerContentComponent,
        WattStorybookDrawerLoadingComponent,
      ],
    }),
  ],
} as Meta;

const template = `
<!-- Notice: the #drawer reference, to access the instance of the drawer -->
<watt-drawer #drawer (closed)="closed()" [size]="size" [loading]="loading">
  <watt-drawer-topbar>
    <span>Top bar</span>
  </watt-drawer-topbar>

  <watt-drawer-actions>
    <watt-button variant="secondary">Secondary action</watt-button>
    <watt-button>Primary action</watt-button>
  </watt-drawer-actions>

  <!--
    @if ensures the content is not loaded before the drawer is open,
    and makes sure it's getting destroyed when drawer is closed
  -->
  @if (drawer.isOpen) {
    <watt-drawer-content>
      <watt-storybook-drawer-content></watt-storybook-drawer-content>
    </watt-drawer-content>
  }
</watt-drawer>

<watt-button (click)="drawer.open()">Open drawer</watt-button><br /><br />
<watt-button (click)="drawer.close()">Close drawer from outside of the drawer</watt-button>
`;

const Drawer: StoryFn<WattDrawerComponent> = (args) => ({
  props: args,
  template,
});

Drawer.parameters = {
  docs: {
    source: {
      code: template
        .replace('<span>Top bar</span>', '<!-- Top bar content -->')
        .replace(
          '<watt-storybook-drawer-content></watt-storybook-drawer-content>',
          '<!-- Main content -->'
        )
        .replace(/<br \/>/g, ''),
    },
  },
};

Drawer.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const openDrawerButton: HTMLInputElement = canvas.getByRole('button', {
    name: /^open drawer/i,
  });
  fireEvent.click(openDrawerButton);
};

export const Small = Drawer.bind({});
Small.args = { size: 'small' };

export const Normal = Drawer.bind({});
Normal.args = { size: 'normal' };

export const Large = Drawer.bind({});
Large.args = { size: 'large' };

export const Multiple: StoryFn<WattDrawerComponent> = (args) => ({
  props: args,
  template: `
    <watt-drawer #first (closed)="closed()">
      @if (first.isOpen) {
        <watt-drawer-content>
          First drawer
        </watt-drawer-content>
      }
    </watt-drawer>

    <watt-drawer #second (closed)="closed()">
      @if (second.isOpen) {
        <watt-drawer-content>
          Second drawer
        </watt-drawer-content>
      }
    </watt-drawer>

    <watt-button (click)="first.open()">Open first</watt-button><br /><br />
    <watt-button (click)="second.open()">Open second</watt-button>
  `,
});

export const Loading: StoryFn<WattDrawerComponent> = (args) => ({
  props: args,
  template: `<watt-storybook-drawer-loading (closed)="closed()"></watt-storybook-drawer-loading>`,
});

export const WithModal: StoryFn<WattDrawerComponent> = (args) => ({
  props: args,
  template: `
    <watt-modal #modal title="Much Overlay" closeLabel="Halp">
      <p>I am a modal within a drawer within a web page within a browser within a window within an operating system within a computer within a room within a house within a city within a country on a planet within a solar system within a galaxy within a super cluster within a universe within a modal within a drawer...</p>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Halp</watt-button>
        <watt-button (click)="modal.close(true)">Whoa</watt-button>
      </watt-modal-actions>
    </watt-modal>

    <watt-drawer #drawer (closed)="closed()" size="small">
      <watt-drawer-topbar>
        <span>Top bar</span>
      </watt-drawer-topbar>
      <watt-drawer-actions>
        <watt-button (click)="modal.open()">Open Modal</watt-button>
      </watt-drawer-actions>
    </watt-drawer>

    <watt-button (click)="drawer.open()">Open drawer</watt-button><br /><br />
  `,
});
