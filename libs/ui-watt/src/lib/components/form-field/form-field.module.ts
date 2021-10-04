import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WattErrorComponent } from './components/error.component';
import { WattLabelComponent } from './components/label.component';
import { WattPrefixDirective } from './directives/prefix.directive';
import { WattSuffixDirective } from './directives/suffix.directive';
import { FormFieldComponent } from './form-field.component';

@NgModule({
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
  declarations: [
    FormFieldComponent,
    WattPrefixDirective,
    WattSuffixDirective,
    WattErrorComponent,
    WattLabelComponent,
  ],
  exports: [
    FormFieldComponent,
    WattPrefixDirective,
    WattSuffixDirective,
    WattErrorComponent,
    WattLabelComponent,
  ],
})
export class WattFormFieldModule {}
