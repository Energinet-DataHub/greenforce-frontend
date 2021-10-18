import { Injectable } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { WattIcon, _allIcons, _customIcons } from "./icons";

@Injectable({providedIn: 'root'})
export class WattIconService {
    constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
        this.addSvgIcon('explore', '/assets/ui-watt/icons/explore.svg');
        this.addSvgIcon('power', '/assets/ui-watt/icons/power.svg')
    }

    isCustomIcon(icon: WattIcon): boolean {
        return Object.values(_customIcons).includes(icon);
    }

    getIconName(icon: WattIcon) {
        return _allIcons[icon];
    }

    private addSvgIcon(icon: WattIcon, url: string) {
        this.iconRegistry.addSvgIcon(this.getIconName(icon), this.sanitizer.bypassSecurityTrustResourceUrl(url));
    }
}