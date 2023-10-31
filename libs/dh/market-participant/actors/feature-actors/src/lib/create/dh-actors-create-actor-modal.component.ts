import { Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { TranslocoDirective } from '@ngneat/transloco';
import { GetOrganizationsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { Apollo } from 'apollo-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'dh-actors-create-actor-modal',
  templateUrl: './dh-actors-create-actor-modal.component.html',
  imports: [
    WATT_MODAL,
    TranslocoDirective,
    WATT_STEPPER,
    WattDropdownComponent,
    ReactiveFormsModule,
  ],
})
export class DhActorsCreateActorModalComponent {
  private _fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private _apollo = inject(Apollo);

  private _getOrganizationsQuery$ = this._apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: GetOrganizationsDocument,
  });

  @ViewChild(WattModalComponent)
  innerModal: WattModalComponent | undefined;

  organizationOptions: WattDropdownOptions = [];

  organizationForm = this._fb.group({ orgId: [''] });

  constructor() {
    this._getOrganizationsQuery$.valueChanges.pipe(takeUntilDestroyed()).subscribe((result) => {
      if (result.data?.organizations) {
        console.log(result.data.organizations);
        this.organizationOptions = result.data.organizations.map((org) => ({
          value: org.organizationId ?? '',
          displayValue: org.name,
        }));
      }
    });
  }

  open() {
    this.innerModal?.open();
  }

  close() {
    this.innerModal?.close(false);
  }
}
