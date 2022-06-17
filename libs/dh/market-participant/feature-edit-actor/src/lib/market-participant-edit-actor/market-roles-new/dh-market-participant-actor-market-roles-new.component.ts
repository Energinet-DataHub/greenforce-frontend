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
  NgModule,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import {
  WattButtonModule,
  WattInputModule,
  WattFormFieldModule,
  WattDropdownModule,
  WattDropdownOption,
} from '@energinet-datahub/watt';
import {
  EicFunction,
  GridAreaDto,
  MarketParticipantMeteringPointType,
} from '@energinet-datahub/dh/shared/domain';
import { MarketRoleService } from './market-role.service';
import { MarketRoleChanges } from '@energinet-datahub/dh/market-participant/data-access-api';

interface EditableMarketRoleRow {
  marketRole: { marketRole?: EicFunction };
  changed: {
    marketRole?: EicFunction;
    gridArea?: string;
    meteringPointTypes?: MarketParticipantMeteringPointType[];
  };
}

@Component({
  selector: 'dh-market-participant-actor-market-roles-new',
  styleUrls: ['./dh-market-participant-actor-market-roles-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-market-participant-actor-market-roles-new.component.html',
  providers: [MarketRoleService],
})
export class DhMarketParticipantActorMarketRolesNewComponent
  implements OnChanges
{
  @Input() gridAreas: GridAreaDto[] = [];

  @Output() changed = new EventEmitter<MarketRoleChanges>();

  columnIds = ['marketRole', 'gridArea', 'meteringPointTypes', 'delete'];

  rows: EditableMarketRoleRow[] = [];
  deleted: { marketRole?: EicFunction }[] = [];

  availableMarketRoles: EicFunction[] =
    this.marketRoleService.getAvailableMarketRoles;

  availableMeteringPointTypes = Object.values(
    MarketParticipantMeteringPointType
  );

  marketRoles: WattDropdownOption[] = [];
  gridAreaOptions: WattDropdownOption[] = [];
  meteringPointTypes: WattDropdownOption[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private translocoService: TranslocoService,
    private marketRoleService: MarketRoleService
  ) {}

  ngOnChanges() {
    this.marketRoles = this.availableMarketRoles.map((mr) => ({
      displayValue: this.translocoService.translate(
        `marketParticipant.marketRoles.${mr}`
      ),
      value: mr,
    }));

    this.gridAreaOptions = this.gridAreas.map((ga) => ({
      displayValue: `${ga.code} - ${ga.name}`,
      value: ga.id,
    }));

    this.meteringPointTypes = this.availableMeteringPointTypes.map((mp) => ({
      displayValue: mp,
      value: mp,
    }));

    this.rows = [this.createPlaceholder()];
  }

  readonly createPlaceholder = (): EditableMarketRoleRow => {
    return {
      marketRole: { marketRole: undefined },
      changed: { marketRole: undefined },
    };
  };

  readonly onDropdownChanged = () => {
    this.onModelChanged();
  };

  readonly onModelChanged = () => {
    this.raiseChanged();
  };

  readonly raiseChanged = () => {
    const grouped = this.rows
      .map((row) => row.changed)
      .reduce(
        (m, row) =>
          m.set(row.marketRole, [
            ...(m.get(row.marketRole) || []),
            {
              gridArea: row.gridArea,
              meteringPointTypes: row.meteringPointTypes,
            },
          ]),
        new Map()
      );

    const marketRoleChanges: MarketRoleChanges = { marketRoles: [] };

    grouped.forEach((v, k) =>
      marketRoleChanges.marketRoles.push({ marketRole: k, gridAreas: v })
    );

    this.changed.emit(marketRoleChanges);
  };

  readonly onRowDelete = (row: EditableMarketRoleRow) => {
    const copy = [...this.rows];
    const index = copy.indexOf(row);
    copy.splice(index, 1);
    this.rows = copy;

    this.cd.detectChanges();
    this.raiseChanged();
  };

  readonly onRowAdd = () => {
    this.rows = [...this.rows, this.createPlaceholder()];
  };
}

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
    FormsModule,
    MatTableModule,
    WattButtonModule,
    WattInputModule,
    WattFormFieldModule,
    WattDropdownModule,
  ],
  exports: [DhMarketParticipantActorMarketRolesNewComponent],
  declarations: [DhMarketParticipantActorMarketRolesNewComponent],
})
export class DhMarketParticipantActorMarketRolesNewComponentScam {}
