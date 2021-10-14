import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { WattIconComponent } from "./icon.component";

@NgModule({
    imports: [MatIconModule],
    declarations: [WattIconComponent],
    exports: [WattIconComponent]
})
export class WattIconModule {}