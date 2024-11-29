import { FormGroup, FormControl } from '@angular/forms';

import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';

export type DhActorForm = FormGroup<{
  glnOrEicNumber: FormControl<string>;
  name: FormControl<string>;
  marketrole: FormControl<EicFunction | null>;
  gridArea: FormControl<string[]>;
  contact: FormGroup<{
    departmentOrName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
  }>;
}>;
