import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { WattIconModule } from "@energinet-datahub/watt";
import { StorybookIconOverviewComponent } from "./storybook-icon-overview.component";

@NgModule({
    imports: [CommonModule, WattIconModule],
    declarations: [StorybookIconOverviewComponent],
    exports: [StorybookIconOverviewComponent]
})
export class StorybookIconOverviewModule {}