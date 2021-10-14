import { Component, Input } from "@angular/core";
import { WattColors } from "@energinet-datahub/watt";
import { WattIcon } from "./icons";

@Component({
    selector: 'watt-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class WattIconComponent {
    @Input() name!: WattIcon;
    @Input() label!: string;
    @Input() color: WattColors = WattColors.primary;
} 