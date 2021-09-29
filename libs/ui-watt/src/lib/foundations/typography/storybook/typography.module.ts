import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { TypographyComponent } from './typography.component';

@NgModule({
  declarations: [TypographyComponent],
  exports: [TypographyComponent],
  imports: [MatCardModule, MatTableModule],
})
export class TypographyModule {}
