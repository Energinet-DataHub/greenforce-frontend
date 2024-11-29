import {
  ChangeDetectorRef,
  Directive,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { concatAll, from, map, reduce, take } from 'rxjs';

import { Permission } from '@energinet-datahub/dh/shared/domain';

import { PermissionService } from './permission.service';

@Directive({
  standalone: true,
  selector: '[dhPermissionRequired]',
})
export class DhPermissionRequiredDirective {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private permissionService = inject(PermissionService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  dhPermissionRequired = input<Permission[]>();

  constructor() {
    effect(
      () => {
        this.viewContainerRef.clear();
        from(this.dhPermissionRequired() ?? [])
          .pipe(
            map((permission) => this.permissionService.hasPermission(permission)),
            concatAll(),
            reduce((hasPermission, next) => hasPermission || next),
            take(1)
          )
          .subscribe((hasPermission) => {
            if (hasPermission) {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
              this.changeDetectorRef.detectChanges();
            }
          });
      },
      { allowSignalWrites: true }
    );
  }
}
