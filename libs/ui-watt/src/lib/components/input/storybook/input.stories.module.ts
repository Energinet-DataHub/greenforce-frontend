import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WattFormFieldModule } from '../../form-field/form-field.module';
import { WattInputModule } from '../input.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    WattFormFieldModule,
    WattInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    WattFormFieldModule,
    WattInputModule,
    ReactiveFormsModule,
  ]
})
export class InputStoriesModule {}
