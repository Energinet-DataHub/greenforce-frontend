import { NgModule } from "@angular/core";
import { WattButtonModule, WattIconModule } from "@energinet-datahub/watt";
import { WattEmptyStateComponent } from "./empty-state.component";

@NgModule({
    imports: [WattIconModule, WattButtonModule],
    declarations: [WattEmptyStateComponent],
    exports: [WattEmptyStateComponent, WattButtonModule]
})
export class WattEmptyStateModule {}