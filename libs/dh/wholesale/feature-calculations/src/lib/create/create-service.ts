import { effect, Injectable } from '@angular/core';
import {
  CreateCalculationDocument,
  CreateCalculationMutationVariables,
  GetCalculationsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { injectToast } from '@energinet-datahub/dh/wholesale/shared';

@Injectable()
export class DhCreateCalculationService {
  private toast = injectToast('wholesale.calculations.create.toast');
  private create = mutation(CreateCalculationDocument, {
    refetchQueries: [GetCalculationsDocument],
  });

  toastEffect = effect(() => this.toast(this.create.status()));
  mutate = (variables: CreateCalculationMutationVariables) => this.create.mutate({ variables });
}
