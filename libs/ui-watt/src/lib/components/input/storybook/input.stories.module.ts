import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WattFormFieldModule } from '../../form-field/form-field.module';
import { WattInputModule } from '../input.module';
import { InputComponent } from './input.component';
import { InputOverviewComponent } from './overview.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    WattFormFieldModule,
    WattInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [InputComponent, InputOverviewComponent],
  exports: [
    WattFormFieldModule,
    WattInputModule,
    ReactiveFormsModule,
    InputComponent,
    InputOverviewComponent,
  ],
})
export class InputStoriesModule {}
