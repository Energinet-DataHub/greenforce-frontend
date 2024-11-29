import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatExpansionPanel, MatExpansionModule } from '@angular/material/expansion';
import { WattButtonComponent } from '../button/watt-button.component';

/**
 * Usage:
 * `import { WattExpansionComponent } from '@energinet-datahub/watt/expansion';`
 */
@Component({
  selector: 'watt-expansion',
  styleUrls: ['./expansion.component.scss'],
  templateUrl: './expansion.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatExpansionModule, WattButtonComponent],
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
