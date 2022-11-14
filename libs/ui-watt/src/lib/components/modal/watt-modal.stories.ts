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
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { WattButtonModule } from '../button';
import { WattInputModule } from '../input/input.module';
import { WattFormFieldModule } from '../form-field/form-field.module';
import { WattModalModule } from './watt-modal.module';
import { WattModalComponent } from './watt-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WattTooltipDirective } from '../tooltip';

export default {
  title: 'Components/Modal',
  component: WattModalComponent,
  decorators: [
    moduleMetadata({
      imports: [
        BrowserAnimationsModule,
        WattButtonModule,
        WattFormFieldModule,
        WattInputModule,
        WattModalModule,
        WattTooltipDirective,
      ],
    }),
  ],
} as Meta<WattModalComponent>;

export const Small: Story<WattModalComponent> = (args) => ({
  props: args,
  template: `
    <watt-button (click)="modal.open()">{{title}}</watt-button>
    <watt-modal #modal [title]="title" [size]="size" [disableClose]="disableClose" closeLabel="Close modal">
      <p>Do you accept the terms?</p>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Reject</watt-button>
        <watt-button (click)="modal.close(true)">Accept</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
});

Small.args = {
  title: 'Accept Terms',
  size: 'small',
  disableClose: true,
};

export const Normal: Story<WattModalComponent> = (args) => ({
  props: args,
  template: `
    <watt-button (click)="modal.open()">{{title}}</watt-button>
    <watt-modal #modal [title]="title" [size]="size" [disableClose]="disableClose" closeLabel="Close modal">
      <br>
      <watt-form-field>
        <watt-label>Username</watt-label>
        <input wattInput [formControl]="exampleFormControl" />
      </watt-form-field>
      <watt-form-field>
        <watt-label>Password</watt-label>
        <input wattInput type="password" [formControl]="exampleFormControl" />
      </watt-form-field>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Cancel</watt-button>
        <watt-button (click)="modal.close(true)">Save</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
});

Normal.args = {
  title: 'Create User',
  size: 'normal',
  disableClose: false,
};

export const Large: Story<WattModalComponent> = (args) => ({
  props: args,
  template: `
    <watt-button (click)="modal.open()">{{title}}</watt-button>
    <watt-modal #modal [title]="title" [size]="size" [disableClose]="disableClose" closeLabel="Close modal">
      <h4 wattTooltip="Tooltip in modal" style="display: inline-block;">Develop across all platforms</h4>
      <p>Learn one way to build applications with Angular and reuse your code and abilities to build apps for any deployment target. For web, mobile web, native mobile and native desktop.</p>
      <h4>Speed &amp; Performance</h4>
      <p>Achieve the maximum speed possible on the Web Platform today, and take it further, via Web Workers and server-side rendering. Angular puts you in control over scalability. Meet huge data requirements by building data models on RxJS, Immutable.js or another push-model.</p>
      <h4>Incredible tooling</h4>
      <p>Build features quickly with simple, declarative templates. Extend the template language with your own components and use a wide array of existing components. Get immediate Angular-specific help and feedback with nearly every IDE and editor. All this comes together so you can focus on building amazing apps rather than trying to make the code work.</p>
      <h4>Loved by millions</h4>
      <p>From prototype through global deployment, Angular delivers the productivity and scalable infrastructure that supports Google's largest applications.</p>
      <h4>What is Angular?</h4>
      <p>Angular is a platform that makes it easy to build applications with the web. Angular combines declarative templates, dependency injection, end to end tooling, and integrated best practices to solve development challenges. Angular empowers developers to build applications that live on the web, mobile, or the desktop</p>
      <h4>Architecture overview</h4>
      <p>Angular is a platform and framework for building client applications in HTML and TypeScript. Angular is itself written in TypeScript. It implements core and optional functionality as a set of TypeScript libraries that you import into your apps.</p>
      <p>The basic building blocks of an Angular application are NgModules, which provide a compilation context for components. NgModules collect related code into functional sets; an Angular app is defined by a set of NgModules. An app always has at least a root module that enables bootstrapping, and typically has many more feature modules.</p>
      <p>Components define views, which are sets of screen elements that Angular can choose among and modify according to your program logic and data. Every app has at least a root component.</p>
      <p>Components use services, which provide specific functionality not directly related to views. Service providers can be injected into components as dependencies, making your code modular, reusable, and efficient.</p>
      <p>Both components and services are simply classes, with decorators that mark their type and provide metadata that tells Angular how to use them.</p>
      <p>The metadata for a component class associates it with a template that defines a view. A template combines ordinary HTML with Angular directives and binding markup that allow Angular to modify the HTML before rendering it for display.</p>
      <p>The metadata for a service class provides the information Angular needs to make it available to components through Dependency Injection (DI).</p>
      <p>An app's components typically define many views, arranged hierarchically. Angular provides the Router service to help you define navigation paths among views. The router provides sophisticated in-browser navigational capabilities.</p>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">No Thanks</watt-button>
        <watt-button (click)="modal.close(true)">Install</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
});

Large.args = {
  title: 'Install Angular',
  size: 'large',
  disableClose: false,
};
