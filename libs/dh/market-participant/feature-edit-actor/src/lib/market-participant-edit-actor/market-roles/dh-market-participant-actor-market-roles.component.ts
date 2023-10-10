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
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattTextFieldTDComponent } from '@energinet-datahub/watt/text-field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';
import {
  MarketParticipantActorMarketRoleDto,
  MarketParticipantActorStatus,
  MarketParticipantEicFunction,
  MarketParticipantGridAreaDto,
  MarketParticipantMeteringPointType,
} from '@energinet-datahub/dh/shared/domain';
import { MarketRoleService } from './market-role.service';
import { MarketRoleChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { MarketRoleGroupService } from './market-role-group.service';

export interface EditableMarketRoleRow {
  existing: boolean;
  marketRole?: MarketParticipantEicFunction;
  gridArea?: string;
  meteringPointTypes?: MarketParticipantMeteringPointType[];
  comment?: string | null;
}

@Component({
  selector: 'dh-market-participant-actor-market-roles',
  styleUrls: ['./dh-market-participant-actor-market-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-market-participant-actor-market-roles.component.html',
  providers: [MarketRoleService, MarketRoleGroupService],
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    FormsModule,
    WattButtonComponent,
    WATT_TABLE,
    WattDropdownComponent,
    WattTextFieldTDComponent,
  ],
})
export class DhMarketParticipantActorMarketRolesComponent implements OnChanges {
  @Input() actorStatus?: MarketParticipantActorStatus;
  @Input() gridAreas: MarketParticipantGridAreaDto[] = [];
  @Input() actorMarketRoles?: MarketParticipantActorMarketRoleDto[] = [];
  @Input() comment?: string;

  @Output() changed = new EventEmitter<MarketRoleChanges>();

  columns: WattTableColumnDef<EditableMarketRoleRow> = {
    marketRole: { accessor: 'marketRole' },
    gridArea: { accessor: 'gridArea' },
    meteringPointTypes: { accessor: 'meteringPointTypes' },
    commentLabel: { accessor: 'comment' },
    delete: { accessor: null, header: '' },
  };

  dataSource = new WattTableDataSource<EditableMarketRoleRow>();
  deleted: { marketRole?: MarketParticipantEicFunction }[] = [];

  availableMeteringPointTypes = Object.values(MarketParticipantMeteringPointType);

  marketRoles: WattDropdownOption[] = [];
  gridAreaOptions: WattDropdownOption[] = [];
  meteringPointTypes: WattDropdownOption[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private translocoService: TranslocoService,
    private marketRoleService: MarketRoleService,
    private marketRoleGroupService: MarketRoleGroupService
  ) {}

  ngOnChanges() {
    this.gridAreaOptions = this.gridAreas.map((ga) => ({
      displayValue: `${ga.code} - ${ga.name}`,
      value: ga.id,
    }));

    this.meteringPointTypes = this.availableMeteringPointTypes.map((mp) => ({
      displayValue: mp,
      value: mp,
    }));

    const rows: EditableMarketRoleRow[] = [];

    if (this.actorMarketRoles) {
      this.actorMarketRoles.forEach((marketRole) =>
        marketRole.gridAreas.forEach((gridArea) =>
          rows.push({
            existing: true,
            marketRole: marketRole.eicFunction,
            gridArea: gridArea.id,
            meteringPointTypes: gridArea.meteringPointTypes,
            comment: marketRole.comment,
          })
        )
      );
    }

    this.dataSource.data = rows;
    this.calculateAvailableMarketRoles();
  }

  readonly onMarketRoleDropdownChanged = () => {
    this.raiseChanged();
    this.calculateAvailableMarketRoles();
  };

  readonly onDropdownChanged = () => {
    this.raiseChanged();
  };

  readonly onCommentChanged = () => {
    this.raiseChanged();
  };

  readonly raiseChanged = () => {
    const grouped = this.marketRoleGroupService.groupRows(this.dataSource.data);

    const marketRoleChanges: MarketRoleChanges = {
      marketRoles: grouped,
      isValid: true,
    };

    marketRoleChanges.isValid = this.dataSource.data.reduce(
      (r, v) =>
        r &&
        !!v.marketRole &&
        !!v.gridArea &&
        !!v.meteringPointTypes &&
        v.meteringPointTypes.length > 0,
      marketRoleChanges.isValid
    );

    this.changed.emit(marketRoleChanges);
  };

  readonly calculateAvailableMarketRoles = () => {
    const currentlySelectedMarketRoles = this.dataSource.data
      .filter((x) => !!x.marketRole)
      .map((x) => x.marketRole as MarketParticipantEicFunction);

    const availableMarketRoles = this.marketRoleService.getAvailableMarketRoles.filter(
      (x) => !this.marketRoleService.notValidInAnySelectionGroup(x, currentlySelectedMarketRoles)
    );

    this.marketRoles = availableMarketRoles
      .map((mr) => ({
        displayValue: this.translocoService.translate(`marketParticipant.marketRoles.${mr}`),
        value: mr,
      }))
      .sort((left, right) => left.displayValue.localeCompare(right.displayValue));
  };

  readonly onRowDelete = (row: EditableMarketRoleRow) => {
    const copy = [...this.dataSource.data];
    const index = copy.indexOf(row);
    copy.splice(index, 1);
    this.dataSource.data = copy;

    this.cd.detectChanges();
    this.raiseChanged();
  };

  readonly onRowAdd = () => {
    this.dataSource.data = [
      ...this.dataSource.data,
      { existing: false, meteringPointTypes: this.availableMeteringPointTypes },
    ];
  };

  readonly isReadonly = (row: EditableMarketRoleRow) =>
    row.existing && this.actorStatus !== MarketParticipantActorStatus.New;
}
