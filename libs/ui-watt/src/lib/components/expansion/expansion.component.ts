import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

/**
 * Usage:
 * `import WattExpansioneModule from '@energinet-datahub/watt';`
 */
@Component({
  selector: 'watt-expansion',
  styleUrls: ['./expansion.component.scss'],
  templateUrl: './expansion.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class WattExpansionComponent {
  @Input() openLabel = '';
  @Input() closeLabel = '';
  @Input() expanded = false;

  /**
   * @ignore
   * @param matExpansionPanel
   */
  onClose(matExpansionPanel: MatExpansionPanel) {
    matExpansionPanel.close();
  }
}
