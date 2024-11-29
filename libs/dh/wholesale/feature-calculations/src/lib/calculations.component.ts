import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { DhCalculationsCreateComponent } from './create/create.component';
import { DhCalculationsDetailsComponent } from './details/details.component';
import { DhCalculationsTableComponent } from './table/table.component';

@Component({
  selector: 'dh-calculations',
  standalone: true,
  imports: [
    DhCalculationsCreateComponent,
    DhCalculationsDetailsComponent,
    DhCalculationsTableComponent,
  ],
  template: `
    <dh-calculations-create #modal />
    <dh-calculations-details [id]="id()" (closed)="navigate(null)" />
    <dh-calculations-table
      [id]="id()"
      (selectedRow)="navigate($event.id)"
      (create)="modal.open()"
    />
  `,
})
export class DhCalculationsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = toSignal<string>(this.route.queryParams.pipe(map((p) => p.id ?? undefined)));

  navigate(id: string | null) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id },
      queryParamsHandling: 'merge',
    });
  }
}
