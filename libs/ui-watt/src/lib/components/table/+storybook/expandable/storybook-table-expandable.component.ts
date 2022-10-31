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
/* eslint-disable sonarjs/no-duplicate-string */
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
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { WattIconSize } from '../../../../foundations/icon';

export interface Process {
  id: string;
  beskrivelse: string;
  indsendt: number;
  skaeringsdato: string;
  status: string;
  childs?: Process[];
  expanded?: boolean;
}

export const data: Process[] = [
  // eslint-disable-next-line sonarjs/no-duplicate-string
  {
    id: '987655',
    beskrivelse: 'Fremsendelse af stamdata (BRS-006)',
    indsendt: 1,
    skaeringsdato: '1. jan 2019',
    status: 'Afsluttet',
    childs: [],
  },
  {
    id: '987656',
    beskrivelse: 'Fremsendelse af stamdata (BRS-006)',
    indsendt: 2,
    skaeringsdato: '1. jan 2019',
    status: 'Afsluttet',
    expanded: true,
    childs: [
      {
        id: '987657',
        beskrivelse: 'Fremsendelse af stamdata (BRS-006)',
        indsendt: 3,
        skaeringsdato: '1. jan 2019',
        status: 'Afsluttet',
      },
      {
        id: '987657',
        beskrivelse: 'Fremsendelse af stamdata (BRS-006)',
        indsendt: 4,
        skaeringsdato: '1. jan 2019',
        status: 'Afsluttet',
      },
      {
        id: '987657',
        beskrivelse: 'Fremsendelse af stamdata (BRS-006)',
        indsendt: 5,
        skaeringsdato: '1. jan 2019',
        status: 'Afsluttet',
      },
      {
        id: '987657',
        beskrivelse: 'Fremsendelse af stamdata (BRS-006)',
        indsendt: 6,
        skaeringsdato: '1. jan 2019',
        status: 'Afsluttet',
      },
    ],
  },
  {
    id: '987657',
    beskrivelse: 'Fremsendelse af stamdata (BRS-006)',
    indsendt: 7,
    skaeringsdato: '1. jan 2019',
    status: 'Afsluttet',
    childs: [],
  },
  {
    id: '987658',
    beskrivelse: 'Fremsendelse af stamdata (BRS-006)',
    indsendt: 8,
    skaeringsdato: '1. jan 2019',
    status: 'Afsluttet',
    childs: [],
  },
  {
    id: '987659',
    beskrivelse: 'Fremsendelse af stamdata (BRS-006)',
    indsendt: 9,
    skaeringsdato: '1. jan 2019',
    status: 'Afsluttet',
    childs: [],
  },
];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'storybook-table-expandable',
  templateUrl: 'storybook-table-expandable.component.html',
  styleUrls: ['storybook-table-expandable.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class StorybookTableExpandableComponent implements AfterViewInit {
  columnsToDisplay: string[] = [
    'tableExpandControl',
    'beskrivelse',
    'indsendt',
    'skaeringsdato',
    'status',
  ];
  sortedData = new MatTableDataSource(data);
  iconSize = WattIconSize;

  @ViewChild(MatSort) matSort?: MatSort;

  ngAfterViewInit(): void {
    this.sortedData.sort = this.matSort ?? null;
    this.setDefaultSorting();
  }

  sortData(sort: Sort) {
    if (sort.direction === '') {
      this.setDefaultSorting();
    }
  }

  setDefaultSorting() {
    this.matSort?.sort(this.matSort.sortables.get('indsendt') as MatSortable);
  }
}
