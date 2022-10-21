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
  WattInputModule,
} from '@energinet-datahub/watt';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattDropdownModule, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import {
  ActorMarketRoleDto,
  ActorStatus,
  EicFunction,
  GridAreaDto,
  MarketParticipantMeteringPointType,
} from '@energinet-datahub/dh/shared/domain';
import { MarketRoleService } from './market-role.service';
import { MarketRoleChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { MarketRoleGroupService } from './market-role-group.service';

export interface EditableMarketRoleRow {
  existing: boolean;
  marketRole?: EicFunction;
  gridArea?: string;
  meteringPointTypes?: MarketParticipantMeteringPointType[];
}

@Component({
  selector: 'dh-market-participant-actor-market-roles',
  styleUrls: ['./dh-market-participant-actor-market-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-market-participant-actor-market-roles.component.html',
  providers: [MarketRoleService, MarketRoleGroupService],
})
export class DhMarketParticipantActorMarketRolesComponent implements OnChanges {
  @Input() actorStatus?: ActorStatus;
  @Input() gridAreas: GridAreaDto[] = [];
  @Input() actorMarketRoles?: ActorMarketRoleDto[] = [];

  @Output() changed = new EventEmitter<MarketRoleChanges>();

  columnIds = ['marketRole', 'gridArea', 'meteringPointTypes', 'delete'];

  rows: EditableMarketRoleRow[] = [];
  deleted: { marketRole?: EicFunction }[] = [];

  availableMeteringPointTypes = Object.values(
    MarketParticipantMeteringPointType
  );

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
          })
        )
      );
    }

    this.rows = rows;
    this.calculateAvailableMarketRoles();
  }

  readonly onMarketRoleDropdownChanged = () => {
    this.raiseChanged();
    this.calculateAvailableMarketRoles();
  };

  readonly onDropdownChanged = () => {
    this.raiseChanged();
  };

  readonly raiseChanged = () => {
    const grouped = this.marketRoleGroupService.groupRows(this.rows);

    const marketRoleChanges: MarketRoleChanges = {
      marketRoles: grouped,
      isValid: true,
    };

    marketRoleChanges.isValid = this.rows.reduce(
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
    const currentlySelectedMarketRoles = this.rows
      .filter((x) => !!x.marketRole)
      .map((x) => x.marketRole as EicFunction);

    const availableMarketRoles =
      this.marketRoleService.getAvailableMarketRoles.filter(
        (x) =>
          !this.marketRoleService.notValidInAnySelectionGroup(
            x,
            currentlySelectedMarketRoles
          )
      );

    this.marketRoles = availableMarketRoles
      .map((mr) => ({
        displayValue: this.translocoService.translate(
          `marketParticipant.marketRoles.${mr}`
        ),
        value: mr,
      }))
      .sort((left, right) =>
        left.displayValue.localeCompare(right.displayValue)
      );
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
    this.rows = [
      ...this.rows,
      { existing: false, meteringPointTypes: this.availableMeteringPointTypes },
    ];
  };

  readonly isReadonly = (row: EditableMarketRoleRow) =>
    row.existing && this.actorStatus !== ActorStatus.New;
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
  exports: [DhMarketParticipantActorMarketRolesComponent],
  declarations: [DhMarketParticipantActorMarketRolesComponent],
})
export class DhMarketParticipantActorMarketRolesComponentScam {}
