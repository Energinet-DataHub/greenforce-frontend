import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'eo-date-picker-dialog',
  template: `<div>TEST CONTENT</div>`,
})
export class EoDatePickerDialogComponent {
  private openerPosition: DOMRect;

  constructor(
    public dialogRef: MatDialogRef<EoDatePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public options: { openerPosition: DOMRect }
  ) {
    this.openerPosition = options.openerPosition;
    console.log('position', this.openerPosition);
    dialogRef.updatePosition({
      left: `${this.openerPosition.x}px`,
      top: `${this.openerPosition.y}px`,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
