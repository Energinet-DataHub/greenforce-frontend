import { Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

const customValueAccessor = {
  multi: true,
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => WattCheckboxComponent),
};

@Component({
  selector: 'watt-checkbox',
  templateUrl: './watt-checkbox.component.html',
  providers: [customValueAccessor],
})
export class WattCheckboxComponent implements ControlValueAccessor {
  internalControl = new FormControl(false);

  writeValue(value: boolean) {
    this.internalControl.setValue(value);
  }

  onValueChange(event: MatCheckboxChange) {
    this.onChange(event.checked);
  }

  registerOnChange(onChangeFn: (isChecked: boolean) => void) {
    this.onChange = onChangeFn;
  }

  registerOnTouched(onTouchFn: () => void) {
    this.onTouched = onTouchFn;
  }

  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.internalControl.disable({ emitEvent: false });
    } else {
      this.internalControl.enable({ emitEvent: false });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (isChecked: boolean) => {
    // Intentionally left empty
  };

  onTouched = () => {
    // Intentionally left empty
  };
}
