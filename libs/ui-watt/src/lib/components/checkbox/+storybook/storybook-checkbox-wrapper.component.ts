import { Component, NgModule } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { WattCheckboxModule } from '../watt-checkbox.module';
import { WattButtonModule } from '../../button';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-checkbox-wrapper',
  templateUrl: './storybook-checkbox-wrapper.component.html',
})
export class StorybookCheckboxWrapperComponent {
  /**
   * @ignore
   */
  exampleFormControl = new FormControl({
    value: true,
    disabled: false,
  });

  /**
   * @ignore
   */
  disableControl() {
    const isEnabled = this.exampleFormControl.enabled;

    if (isEnabled) {
      this.exampleFormControl.disable();
    } else {
      this.exampleFormControl.enable();
    }
  }
}

@NgModule({
  declarations: [StorybookCheckboxWrapperComponent],
  exports: [StorybookCheckboxWrapperComponent],
  imports: [WattCheckboxModule, WattButtonModule, ReactiveFormsModule],
})
export class StorybookCheckboxWrapperScam {}
