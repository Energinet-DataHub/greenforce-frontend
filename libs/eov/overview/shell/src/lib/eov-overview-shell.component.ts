import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { eovApiEnvironmentToken } from '@energinet-datahub/eov/shared/environments';
import { WattIconComponent } from "@energinet-datahub/watt/icon";
import { WattTableColumnDef, WattTableComponent, WattTableDataSource } from "@energinet-datahub/watt/table";
import { take } from "rxjs";

@Component({
    selector: 'eov-overview-shell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
      div.container__content {
        padding: 10px 0 0 0;
      }
    `],
    standalone: true,
    template: `
    <div class="container__content">
      <h2>Målepunkter</h2>
      <watt-table
        #table
        description="Målepunkter"
        sortBy="position"
        sortDirection="asc"
        [dataSource]="dataSource"
        [columns]="columns"
        [selectable]="false"
        [suppressRowHoverHighlight]="false"
        [activeRow]="activeRow"
        (rowClick)="activeRow = $event"
      />
    </div>
  `,
    imports: [
        WattTableComponent,
        WattIconComponent
    ]
})
export class EovOverviewShellComponent {
  environment = inject(eovApiEnvironmentToken);
  route = inject(ActivatedRoute);
  http: HttpClient = inject(HttpClient);
  activeRow?: MeteringPointDto;
  dataSource: WattTableDataSource<MeteringPointDto> = new WattTableDataSource<MeteringPointDto>([]);
  columns: WattTableColumnDef<MeteringPointDto> = {
    name: { accessor: 'meteringPointAlias' },
    address: { accessor: 'address' },
    postalCode: { accessor: 'postcode' },
    city: { accessor: 'cityName' },
    supplier: { accessor: 'balanceSupplierName' },
    type: { accessor: 'typeOfMP' }

  };
  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['link']) {
        this.handleAfterLogin(params);
      }
    });
  }

  private handleAfterLogin(params: Params) {
    this.http
      .get<PortalTokenResponse>(decodeURIComponent(params['link']), )
      .pipe(take(1))
      .subscribe((token) => {
            let params = new HttpHeaders();
            params = params.set('Authorization', 'Bearer ' + token.token);
            this.http.get<MeteringPointDto[]>(this.environment.customerApiUrl + '/api/MeteringPoint', { headers: params}).subscribe((result) => {
              this.dataSource.data = result;
          });
        }
      );
  }

}


type PortalTokenResponse = {
  token: string;
  refreshToken: string;
  expireTime: Date;
  isSucceeded?: boolean;
  validationError?: NemidValidationError;
}

type BaseResponse<T> = {
  result: T;
  success: boolean;
  errorCode: number;
  errorText: string;
  id: string;
}

interface ChildMeteringPointDto {
  parentMeteringPointId: string;
  meteringPointId: string;
  typeOfMP: string;
  meteringPointAlias: string;
  meterReadingOccurrence: string;
  meterNumber: string;
}

interface MeteringPointBaseDto {
  meteringPointId: string;
  typeOfMP: string;
  balanceSupplierName: string;
  postcode: string;
  cityName: string;
  hasRelation: boolean;
  consumerCVR: string;
  dataAccessCVR: string;
  childMeteringPoints: ChildMeteringPointDto[];
}

interface MeteringPointDto extends MeteringPointBaseDto {
  meteringPointAlias: string;
  address: string;
  cvr: string;
}

interface NemidValidationError {
  errorMessage: string;
  userMessage: string;
  flowErrorCode: string;
  flowExpired: boolean;
  status: FlowStatus;
}

enum FlowStatus {
  Ok = 0,
  UserCancel = 1,
  ClientFlowError = 2,
  FlowError = 3,
  ValidationError = 4,
}
