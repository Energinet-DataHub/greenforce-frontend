import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ColorComponent } from './color.component';

@NgModule({
    imports: [CommonModule, MatCardModule],
    declarations: [ColorComponent],
    providers: [
        { provide: Window, useValue: window }
    ],
    exports: [ColorComponent]
})
export class ColorModule {}
