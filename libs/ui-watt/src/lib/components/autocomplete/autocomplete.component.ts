import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'watt-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent {
  /**
   * @ignore
   */
  myControl = new FormControl();
  /**
   * Sets the label for the autocomplete.
   *
   * @required
   */
  @Input() label = '';
  /**
   * Sets the placeholder for the autocomplete.
   *
   * @required
   */
  @Input() placeholder = '';
  /**
   *
   * Sets the options for the autocomplete.
   */
  @Input() options: string[] = [];
}
