import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WattTableComponent } from './table.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [WattTableComponent],
  exports: [WattTableComponent],
  imports: [CommonModule, MatTableModule]
})
export class WattTableModule {}
