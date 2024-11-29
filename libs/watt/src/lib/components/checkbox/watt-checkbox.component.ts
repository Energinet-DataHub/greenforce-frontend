import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  ViewEncapsulation,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'watt-checkbox',
  styleUrls: ['./watt-checkbox.component.scss'],
  template: `<label>
    <input
      [ngModel]="checked"
      [disabled]="isdisabled"
      [indeterminate]="indeterminate"
      [required]="required"
      (ngModelChange)="onModelChange($event)"
      type="checkbox"
    />
    <ng-content />
  </label>`,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WattCheckboxComponent),
      multi: true,
    },
  ],
  imports: [FormsModule],
})
export class WattCheckboxComponent implements ControlValueAccessor {
  private element = inject(ElementRef);

  checked: boolean | null = null;

  @HostBinding('class.watt-checkbox--disabled')
  isdisabled = false;

  @HostBinding('class.watt-checkbox--indeterminate')
  indeterminate = false;

  @Input() required = false;

  onChange: (value: boolean) => void = () => {
    //
  };

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value: boolean) => void): void {
    this.element.nativeElement.addEventListener('focusout', fn);
  }

  writeValue(checked: boolean | null) {
    this.indeterminate = checked === null ? true : false;
    this.checked = checked;
  }

  onModelChange(e: boolean) {
    this.indeterminate = false;
    this.checked = e;
    this.onChange(e);
  }

  setDisabledState(isDisabled: boolean): void {
    this.isdisabled = isDisabled;
  }
}
