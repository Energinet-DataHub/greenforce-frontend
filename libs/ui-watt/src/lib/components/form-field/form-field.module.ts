import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormFieldComponent } from "./form-field.component";

@NgModule({
    imports: [CommonModule, MatFormFieldModule, MatInputModule],
    declarations: [FormFieldComponent],
    exports: [FormFieldComponent],
})
export class FormFieldModule {}