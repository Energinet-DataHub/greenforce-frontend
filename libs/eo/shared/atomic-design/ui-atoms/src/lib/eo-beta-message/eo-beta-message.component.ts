import {ChangeDetectionStrategy, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {WattButtonComponent} from "@energinet-datahub/watt/button";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-eo-beta-message',
  standalone: true,
  imports: [CommonModule, WattButtonComponent],
  templateUrl: './eo-beta-message.component.html',
  styleUrls: ['./eo-beta-message.component.scss'],
})

export class EoBetaMessageComponent {
  isVisible: boolean = true;

  closeMessage() {
    this.isVisible = false;
  }
}
