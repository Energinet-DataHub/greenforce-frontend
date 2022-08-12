/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
