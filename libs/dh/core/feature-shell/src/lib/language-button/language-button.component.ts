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
  templateUrl: './language-button.component.html',
  styleUrls: ['./language-button.component.scss'],
})
export class LanguageButtonComponent {
  @Input()
  isDisabled = false;
  @Input()
  language = DisplayLanguage.Danish;
  @Output()
  languageSelect = new EventEmitter<void>();
}
