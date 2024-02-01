import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { forkJoin, from, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_DIALOG_DATA, WattModalComponent } from '@energinet-datahub/watt/modal';

@Component({
  selector: 'eov-declaration-dialog',
  standalone: true,
  imports: [CommonModule, TranslocoPipe, WattButtonComponent, WattModalComponent],
  templateUrl: './declaration-dialog.component.html',
  styleUrl: './declaration-dialog.component.scss'
})
export class DeclarationDialogComponent implements OnInit {
  http = inject(HttpClient);
  year: string = inject(WATT_DIALOG_DATA).year;
  month?: string = inject(WATT_DIALOG_DATA).month;

  ngOnInit(): void {
    this.calculate();
  }

  print() {

  }

  calculate() {
    if (!this.year) return;

  }
}
