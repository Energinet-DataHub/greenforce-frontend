import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { timer } from 'rxjs';

import { WATT_CARD } from '../../card';

@Component({
  selector: 'watt-storybook-drawer-content',
  template: `
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis officia
      quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt numquam dolorum!
      Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis officia
      quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt numquam dolorum!
      Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis officia
      quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt numquam dolorum!
      Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
    </p>
    <watt-card>
      <watt-card-title
        ><h3>Drawer has been opened for: {{ timer$ | async }}s</h3></watt-card-title
      >
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda perspiciatis
        officia quam recusandae, voluptate ratione pariatur temporibus, consequuntur deserunt
        numquam dolorum! Sequi assumenda amet, laboriosam omnis ex sapiente voluptatibus?
      </p>
    </watt-card>
  `,
  standalone: true,
  imports: [AsyncPipe, WATT_CARD],
})
export class WattStorybookDrawerContentComponent {
  timer$ = timer(0, 1000);
}
