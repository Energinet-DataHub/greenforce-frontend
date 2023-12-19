import { FormGroup, FormControl } from '@angular/forms';

import { EicFunctionType } from '@energinet-datahub/dh/shared/domain/graphql';

export type ActorForm = FormGroup<{
  glnOrEicNumber: FormControl<string>;
  name: FormControl<string>;
  marketrole: FormControl<EicFunctionType | null>;
  gridArea: FormControl<string[]>;
  contact: FormGroup<{
    departmentOrName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
  }>;
}>;
