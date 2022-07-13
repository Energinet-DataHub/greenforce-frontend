import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'watt-storybook-drawer-content',
  template: `
    <p>Drawer has been opened for: {{timer$ | async}}s</p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
  `,
})
export class WattStorybookDrawerContentComponent {
  timer$ = timer(0, 1000);
}

@NgModule({
  declarations: [WattStorybookDrawerContentComponent],
  exports: [WattStorybookDrawerContentComponent],
  imports: [CommonModule]
})
export class WattStorybookDrawerContentModule {}
