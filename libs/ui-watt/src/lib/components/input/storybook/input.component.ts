import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'watt-input',
  styleUrls: ['./input.component.scss'],
  template: `<watt-form-field>
      <watt-label>label</watt-label>
      <input wattInput type="text" [formControl]="exampleFormControlProjected" placeholder="Søg på Målepunkts ID"/>
      <button wattPrefix aria-label="search">
        icon
      </button>
      <button wattSuffix aria-label="Clear">
        clear
      </button>
      <watt-error *ngIf="exampleFormControlProjected.hasError('required')">
      This field is required
      </watt-error>
    </watt-form-field>`,
})
export class InputComponent implements OnInit, AfterViewInit {
  exampleFormControl = new FormControl('', [
    Validators.required
  ]);

  exampleFormControlProjected = new FormControl('', [
    Validators.required
  ]);

  ngOnInit() {
    this.exampleFormControl.markAsTouched();
  }

  ngAfterViewInit() {
    this.exampleFormControlProjected.markAsTouched();
  }
}
