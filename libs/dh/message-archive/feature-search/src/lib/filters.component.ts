import { Component, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattFilterChipComponent } from '@energinet-datahub/watt/chip';
import { WattDateChipComponent } from '@energinet-datahub/watt/datepicker';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';

import { DhDropdownTranslatorDirective } from '@energinet-datahub/dh/shared/ui-util';
import { DhMessageArchiveSearchFormService } from './form.service';
import {
  DocumentType,
  GetArchivedMessagesQueryVariables,
} from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-message-archive-search-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    VaterStackComponent,
    WattDateChipComponent,
    WattDropdownComponent,
    WattFilterChipComponent,
    WattFormChipDirective,
    DhDropdownTranslatorDirective,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="form.root"
      *transloco="let t; read: 'messageArchive.filters'"
    >
      @if (isSearchingById()) {
        <watt-filter-chip [formControl]="this.form.controls.includeRelated">
          {{ t('includeRelated') }}
        </watt-filter-chip>
      } @else {
        <watt-date-chip [formControl]="form.controls.start" [placeholder]="t('start')" />

        <watt-date-chip [formControl]="form.controls.end" [placeholder]="t('end')" />

        <watt-dropdown
          [formControl]="form.controls.documentTypes"
          [chipMode]="true"
          [multiple]="true"
          [options]="form.documentTypeOptions"
          [placeholder]="t('documentType')"
          [getCustomTrigger]="getDocumentTypeTrigger"
          dhDropdownTranslator
          translateKey="messageArchive.documentType"
        />

        <watt-dropdown
          [formControl]="form.controls.businessReasons"
          [chipMode]="true"
          [multiple]="true"
          [options]="form.businessReasonOptions"
          [placeholder]="t('businessReason')"
          [getCustomTrigger]="getBusinessReasonTrigger"
          dhDropdownTranslator
          translateKey="messageArchive.businessReason"
        />

        @if (form.isActorControlsEnabled()) {
          <watt-dropdown
            [formControl]="form.controls.senderId"
            [chipMode]="true"
            [options]="form.actorOptions()"
            [placeholder]="t('sender')"
          />

          <watt-dropdown
            [formControl]="form.controls.receiverId"
            [chipMode]="true"
            [options]="form.actorOptions()"
            [placeholder]="t('receiver')"
          />
        }
      }
    </form>
  `,
})
export class DhMessageArchiveSearchFiltersComponent {
  isSearchingById = input(false);
  filter = output<GetArchivedMessagesQueryVariables>();

  form = inject(DhMessageArchiveSearchFormService);

  // value is always an array since dropdown is in `multiple` mode
  getDocumentTypeTrigger = (value: string | string[]) =>
    this.form.getDocumentTypeIdentifier(value[0] as DocumentType);

  // value is always an array since dropdown is in `multiple` mode
  getBusinessReasonTrigger = (value: string | string[]) => value[0];

  filterEffect = effect(() => this.filter.emit(this.form.values()));
}
