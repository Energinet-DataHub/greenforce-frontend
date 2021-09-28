import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { InputDirective } from "./input.directive";

@NgModule({
    imports: [MatFormFieldModule, MatInputModule],
    declarations: [InputDirective],
    exports: [InputDirective],
})
export class InputModule {}