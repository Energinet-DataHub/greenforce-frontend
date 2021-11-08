import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DisplayLanguage } from '@energinet-datahub/dh/globalization/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-language-button',
  templateUrl: './dh-language-button.component.html',
  styleUrls: ['./dh-language-button.component.scss'],
})
export class DhLanguageButtonComponent {
  @Input()
  isDisabled = false;
  @Input()
  language = DisplayLanguage.Danish;
  @Output()
  languageSelect = new EventEmitter<void>();
}
