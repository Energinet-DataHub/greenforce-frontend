import { Component, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'watt-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent implements AfterViewInit {
  viewInitialized = false;

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('WHAT?')
    this.viewInitialized = true;  
    }, 2000);
    
  }
}
