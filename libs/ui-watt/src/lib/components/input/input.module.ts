import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WattInputDirective } from './input.directive';

@NgModule({
  imports: [MatFormFieldModule, MatInputModule],
  declarations: [WattInputDirective],
  exports: [WattInputDirective],
})
export class WattInputModule {}
