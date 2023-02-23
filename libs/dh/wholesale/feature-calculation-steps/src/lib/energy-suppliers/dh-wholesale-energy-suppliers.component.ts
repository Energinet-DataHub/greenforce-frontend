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
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ApolloError } from '@apollo/client';
import { Apollo } from 'apollo-angular';

import { graphql } from '@energinet-datahub/dh/shared/domain';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

@Component({
  standalone: true,
  selector: 'dh-wholesale-energy-suppliers',
  imports: [
    CommonModule,
    TranslocoModule,
    WATT_TABLE,
    WattEmptyStateModule,
    WattPaginatorComponent,
    WattSpinnerModule,
  ],
  templateUrl: './dh-wholesale-energy-suppliers.component.html',
  styleUrls: ['./dh-wholesale-energy-suppliers.component.scss'],
})
export class DhWholesaleEnergySuppliersComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private apollo = inject(Apollo);

  @Input() batchId!: string;
  @Input() gridAreaCode!: string;

  @Output() rowClick = new EventEmitter<graphql.Actor>();

  _columns: WattTableColumnDef<graphql.Actor> = {
    energySupplier: { accessor: 'number' },
  };

  _dataSource = new WattTableDataSource<graphql.Actor>();
  actors?: graphql.Actor[];
  loading = false;
  error?: ApolloError;
  selectedActor?: graphql.Actor;
  routeActorNumber?: string;

  ngOnInit() {
    this.apollo
      .watchQuery({
        useInitialLoading: true,
        notifyOnNetworkStatusChange: true,
        query: graphql.GetProcessStepActorsDocument,
        variables: { step: 2, batchId: this.batchId, gridArea: this.gridAreaCode },
      })
      .valueChanges.subscribe((result) => {
        this.actors = result.data?.processStep?.actors ?? undefined;
        if (this.actors) this._dataSource.data = this.actors;
        this.loading = result.loading;
        this.error = result.error;
      });
  }

  getActiveActor = () =>
    this.actors?.find((actor) => actor.number === this.route.firstChild?.snapshot.params.gln);
}
