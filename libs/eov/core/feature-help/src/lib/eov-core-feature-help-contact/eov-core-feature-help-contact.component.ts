import { ChangeDetectionStrategy, Component } from "@angular/core";
import { WattButtonComponent } from "@energinet-datahub/watt/button";
import { WATT_MODAL } from "@energinet-datahub/watt/modal";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WattButtonComponent, WATT_MODAL],
  standalone: true,
  template: `
    <watt-modal #modal title="Kontakt" size="large">
      Don't call us, we'll call you!

      <watt-modal-actions>
        <watt-button (click)="modal.close(false)">Luk</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
})
export class EovCoreFeatureHelpContactComponent {

}
