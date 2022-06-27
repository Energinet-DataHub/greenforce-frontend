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
  OnInit,
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
  ActorMarketRoleDto,
  EicFunction,
  GridAreaDto,
  MarketParticipantMeteringPointType,
} from '@energinet-datahub/dh/shared/domain';
import { MarketRoleService } from './market-role.service';
import { MarketRoleChanges } from '@energinet-datahub/dh/market-participant/data-access-api';
import { Observable } from 'rxjs';

interface EditableMarketRoleRow {
  marketRole: { marketRole?: EicFunction };
  changed: {
    marketRole?: EicFunction;
    gridArea?: string;
    meteringPointTypes?: MarketParticipantMeteringPointType[];
  };
}

@Component({
  selector: 'dh-market-participant-actor-market-roles',
  styleUrls: ['./dh-market-participant-actor-market-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-market-participant-actor-market-roles.component.html',
  providers: [MarketRoleService],
})
export class DhMarketParticipantActorMarketRolesComponent
  implements OnChanges, OnInit
{
  @Input() gridAreas: GridAreaDto[] = [];

  @Input() actorMarketRoles?: ActorMarketRoleDto[] = [];
  @Input() triggerValidation?: Observable<void>;

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
    private marketRoleService: MarketRoleService
  ) {}

  ngOnInit(): void {
    this.triggerValidation?.subscribe(() => {
      // todo: missing a way to trigger validation on dropdown
      // @ViewChildren(WattDropdownComponent)
      // readonly dropDowns: QueryList<WattDropdownComponent> = new QueryList<WattDropdownComponent>();
    });
  }

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

    if (this.actorMarketRoles)
      this.actorMarketRoles.forEach((mr) =>
        mr.gridAreas.forEach((ga) =>
          rows.push({
            marketRole: { marketRole: mr.eicFunction },
            changed: {
              marketRole: mr.eicFunction,
              gridArea: ga.id,
              meteringPointTypes: ga.meteringPointTypes,
            },
          })
        )
      );

    this.rows = rows;
    this.calculateAvailableMarketRoles();
  }

  readonly createPlaceholder = (): EditableMarketRoleRow => {
    return {
      marketRole: { marketRole: undefined },
      changed: { marketRole: undefined },
    };
  };

  readonly onMarketRoleDropdownChanged = () => {
    this.raiseChanged();
    this.calculateAvailableMarketRoles();
  };

  readonly onDropdownChanged = () => {
    this.raiseChanged();
  };

  readonly raiseChanged = () => {
    const grouped = this.rows
      .map((row) => row.changed)
      .reduce((m, row) => {
        m.set(row.marketRole, [...(m.get(row.marketRole) || [])]);
        if (row.gridArea)
          m.set(row.marketRole, [
            ...m.get(row.marketRole),
            {
              id: row.gridArea,
              meteringPointTypes: row.meteringPointTypes,
            },
          ]);
        return m;
      }, new Map());

    const marketRoleChanges: MarketRoleChanges = {
      marketRoles: [],
      isValid: true,
    };

    grouped.forEach((v, k) =>
      marketRoleChanges.marketRoles.push({ marketRole: k, gridAreas: v })
    );

    marketRoleChanges.isValid = this.rows.reduce(
      (r, v) =>
        r &&
        !!v.changed.marketRole &&
        !!v.changed.gridArea &&
        !!v.changed.meteringPointTypes &&
        v.changed.meteringPointTypes.length > 0,
      marketRoleChanges.isValid
    );

    this.changed.emit(marketRoleChanges);
  };

  readonly calculateAvailableMarketRoles = () => {
    const currentlySelectedMarketRoles = this.rows
      .filter(
        (x) =>
          x.changed?.marketRole !== undefined && x.changed?.marketRole !== null
      )
      .map((x) => x.changed.marketRole as EicFunction);

    const availableMarketRoles =
      this.marketRoleService.getAvailableMarketRoles.filter(
        (x) =>
          !this.marketRoleService.notValidInAnySelectionGroup(
            x,
            currentlySelectedMarketRoles
          )
      );

    this.marketRoles = availableMarketRoles.map((mr) => ({
      displayValue: this.translocoService.translate(
        `marketParticipant.marketRoles.${mr}`
      ),
      value: mr,
    }));
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
  exports: [DhMarketParticipantActorMarketRolesComponent],
  declarations: [DhMarketParticipantActorMarketRolesComponent],
})
export class DhMarketParticipantActorMarketRolesComponentScam {}
