import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WattFormFieldModule } from '../../form-field';
import { WattDatepickerModule } from './watt-datepicker.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorybookConfigurationLocalizationModule } from '../+storybook/storybook-configuration-localization.module';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';

import { template } from './+storybook/template';
import { CommonModule } from '@angular/common';
import { withFormControl } from './+storybook/watt-datepicker-reactive-forms.stories';
import { StoryFn } from '@storybook/angular';



@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    WattFormFieldModule,
    WattDatepickerModule,
  ],
  template
})
class WrapperComponent implements OnInit {
  exampleFormControlSingle = new FormControl('');
  exampleFormControlRange = new FormControl({
    start: '',
    end: ''
  });
  private cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.cd.detectChanges();
  }
}

it('should mount', () => {
  cy.mount(WrapperComponent, {
    imports: [
      BrowserAnimationsModule,
      StorybookConfigurationLocalizationModule.forRoot()
    ]
  });
});

it('should type', () => {
  cy.mount(WrapperComponent, {
    imports: [
      BrowserAnimationsModule,
      StorybookConfigurationLocalizationModule.forRoot()
    ]
  });

  cy.findByRole('textbox', {
    name: /^date-input/i,
  }).type('22-02-2222');
});
