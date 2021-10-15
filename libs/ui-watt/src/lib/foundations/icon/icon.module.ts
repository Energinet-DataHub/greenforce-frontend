import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { WattIconComponent } from "./icon.component";
import { WattIcon } from "./icons";

@NgModule({
    imports: [MatIconModule, HttpClientModule, CommonModule],
    declarations: [WattIconComponent],
    exports: [WattIconComponent]
})
export class WattIconModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon(WattIcon.explore, sanitizer.bypassSecurityTrustResourceUrl('/assets/ui-watt/icons/explore.svg'));
        iconRegistry.addSvgIcon(WattIcon.power, sanitizer.bypassSecurityTrustResourceUrl('/assets/ui-watt/icons/explore.svg'));
    }
}