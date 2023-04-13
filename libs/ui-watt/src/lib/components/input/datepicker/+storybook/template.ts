export const template = `
<watt-form-field>
  <watt-label>Single date</watt-label>
  <watt-datepicker [formControl]="exampleFormControlSingle"></watt-datepicker>
  <watt-error *ngIf="exampleFormControlSingle?.errors?.required">
      Date is required
  </watt-error>
</watt-form-field>

<p>Value: <code>{{ exampleFormControlSingle.value | json }}</code></p>
<p *ngIf="withValidations">Errors: <code>{{ exampleFormControlSingle?.errors | json }}</code></p>

<br />

<watt-form-field>
  <watt-label>Date range</watt-label>
  <watt-datepicker [formControl]="exampleFormControlRange" [range]="true"></watt-datepicker>
  <watt-error *ngIf="exampleFormControlRange?.errors?.rangeRequired">
      Date range is required
  </watt-error>
</watt-form-field>

<p>Selected range: <code data-testid="rangeValue">{{ exampleFormControlRange.value | json }}</code></p>
<p *ngIf="withValidations">Errors: <code>{{ exampleFormControlRange?.errors | json }}</code></p>
`;
