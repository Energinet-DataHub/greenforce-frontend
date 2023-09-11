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

import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  SimpleChanges,
} from '@angular/core';
import { ActorContactChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';
import { WattInputDirective } from '@energinet-datahub/watt/input';
import { WATT_FORM_FIELD } from '@energinet-datahub/watt/form-field';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  MarketParticipantActorContactDto,
  MarketParticipantContactCategory,
} from '@energinet-datahub/dh/shared/domain';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

interface EditableActorContactRow {
  contact: MarketParticipantActorContactDto;
  changed: ActorContactChanges;
  isExisting: boolean;
  isModified: boolean;
  isNewPlaceholder: boolean;
}

@Component({
  selector: 'dh-market-participant-actor-contact-data',
  styleUrls: ['./dh-market-participant-actor-contact-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-market-participant-actor-contact-data.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    FormsModule,
    WattButtonComponent,
    WattInputDirective,
    WATT_FORM_FIELD,
    WATT_TABLE,
    WattDropdownComponent,
  ],
})
export class DhMarketParticipantActorContactDataComponent implements OnChanges {
  @Input() contacts: MarketParticipantActorContactDto[] = [];
  @Output() contactsChanged = new EventEmitter<{
    isValid: boolean;
    add: ActorContactChanges[];
    remove: MarketParticipantActorContactDto[];
  }>();

  constructor(private cd: ChangeDetectorRef) {}

  columns: WattTableColumnDef<EditableActorContactRow> = {
    category: { accessor: (row) => row.changed.category },
    name: { accessor: (row) => row.changed.name },
    email: { accessor: (row) => row.changed.email },
    phone: { accessor: (row) => row.changed.phone },
    delete: { accessor: null, header: '' },
  };

  contactCategories: WattDropdownOption[] = Object.keys(MarketParticipantContactCategory).map(
    (key) => ({
      displayValue: key,
      value: key,
    })
  );

  dataSource = new WattTableDataSource<EditableActorContactRow>();
  deletedContacts: MarketParticipantActorContactDto[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contacts?.previousValue === changes.contacts?.currentValue) return;

    const contacts = this.contacts;
    if (contacts === undefined) return;

    this.dataSource.data = contacts
      .map(
        (contact): EditableActorContactRow => ({
          isExisting: true,
          isModified: false,
          isNewPlaceholder: false,
          contact: contact,
          changed: {
            category: contact.category,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
          },
        })
      )
      .concat([this.createPlaceholder()]);
  }

  readonly onRowDelete = (row: EditableActorContactRow) => {
    if (row.isExisting) {
      this.deletedContacts = [...this.deletedContacts, row.contact];
    }

    const copy = [...this.dataSource.data];
    const index = copy.indexOf(row);
    copy.splice(index, 1);
    this.dataSource.data = copy;

    this.cd.detectChanges();
    this.raiseContactsChanged();
  };

  readonly onDropdownChanged = (row: EditableActorContactRow) => {
    if (!row.isNewPlaceholder) {
      this.onModelChanged(row);
    }
  };

  readonly onModelChanged = (row: EditableActorContactRow) => {
    if (row.isNewPlaceholder) {
      row.isNewPlaceholder = false;
      this.dataSource.data = [...this.dataSource.data, this.createPlaceholder()];
    }

    row.isModified =
      row.changed.category !== row.contact.category ||
      row.changed.name !== row.contact.name ||
      row.changed.email !== row.contact.email ||
      row.changed.phone !== row.contact.phone;

    this.raiseContactsChanged();
  };

  readonly raiseContactsChanged = () => {
    const oldModified = this.dataSource.data
      .filter((row) => row.isModified)
      .filter((row) => row.isExisting)
      .map((row) => row.contact);

    const newModified = this.dataSource.data
      .filter((row) => row.isModified)
      .filter((row) => !row.isNewPlaceholder)
      .map((row) => row.changed);

    const allCategoriesUnique =
      newModified.map((x) => x.category).filter((c, i, s) => s.indexOf(c) === i).length ===
      newModified.length;

    const isValid =
      allCategoriesUnique &&
      newModified.reduce(
        (r, n) =>
          r && !!n.category && !!n.name && n.name.length > 0 && !!n.email && n.email.length > 0,
        true
      );

    this.contactsChanged.emit({
      isValid: isValid,
      add: newModified,
      remove: this.deletedContacts.concat(oldModified),
    });
  };

  readonly createPlaceholder = (): EditableActorContactRow => {
    return {
      isExisting: false,
      isModified: false,
      isNewPlaceholder: true,
      contact: { category: 'Default', name: '', email: '', contactId: '' },
      changed: { category: 'Default', name: '', email: '' },
    };
  };
}
