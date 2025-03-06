//#region License
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
//#endregion
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import type { ResultOf } from '@graphql-typed-document-node/core';
import { tapResponse } from '@ngrx/operators';
import { finalize, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  GetActorCredentialsDocument,
  RequestClientSecretCredentialsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery, mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { ApiErrorCollection } from '@energinet-datahub/dh/market-participant/data-access-api';

type ActorCredentials = ResultOf<typeof GetActorCredentialsDocument>['actorById']['credentials'];

@Injectable()
export class DhMarketPartyB2BAccessStore {
  private readonly client = inject(HttpClient);

  private readonly requestClientSecretCredentials = mutation(
    RequestClientSecretCredentialsDocument
  );

  private readonly actorCredentialQuery = lazyQuery(GetActorCredentialsDocument, {
    fetchPolicy: 'network-only',
  });

  private credentials: Signal<ActorCredentials | null | undefined> = computed(
    () => this.actorCredentialQuery.data()?.actorById.credentials
  );

  removeInProgress = signal(false);

  readonly doCredentialsExist = computed(
    () =>
      !!this.credentials()?.certificateCredentials || !!this.credentials()?.clientSecretCredentials
  );

  readonly certificateMetadata = computed(() => this.credentials()?.certificateCredentials);
  readonly doesCertificateExist = computed(() => !!this.certificateMetadata());

  readonly clientSecretMetadata = computed(() => this.credentials()?.clientSecretCredentials);
  readonly doesClientSecretMetadataExist = computed(() => !!this.clientSecretMetadata());
  readonly clientSecret = signal<string | undefined>(undefined);
  readonly clientSecretExists = computed(() => !!this.clientSecret());

  readonly uploadInProgress = signal(false);
  readonly generateSecretInProgress = signal(false);
  readonly showSpinner = computed(
    () => this.actorCredentialQuery.loading() || this.removeInProgress()
  );

  private readonly assignCertificateCredentialsUrl = computed(
    () => this.credentials()?.assignCertificateCredentialsUrl
  );

  private readonly removeCertificateCredentialsUrl = computed(
    () => this.credentials()?.removeActorCredentialsUrl
  );

  public getCredentials(actorId: string): void {
    this.actorCredentialQuery.refetch({ actorId });
  }

  public uploadCertificate({
    file,
    onSuccess,
    onError,
  }: {
    file: File;
    onSuccess: () => void;
    onError: (apiErrorCollection: ApiErrorCollection) => void;
  }) {
    const uploadUrl = this.assignCertificateCredentialsUrl();

    if (!uploadUrl) return;

    this.uploadInProgress.set(true);

    const formData: FormData = new FormData();
    formData.append('certificate', file);

    this.client
      .post(uploadUrl, formData)
      .pipe(
        tapResponse(
          () => onSuccess(),
          (errorResponse: HttpErrorResponse) =>
            onError(this.createApiErrorCollection(errorResponse))
        ),
        finalize(() => this.uploadInProgress.set(false))
      )
      .subscribe();
  }

  public replaceCertificate({
    file,
    onSuccess,
    onError,
  }: {
    file: File;
    onSuccess: () => void;
    onError: (apiErrorCollection: ApiErrorCollection) => void;
  }) {
    const uploadUrl = this.assignCertificateCredentialsUrl();
    const deleteUrl = this.removeCertificateCredentialsUrl();

    if (!uploadUrl || !deleteUrl) return;

    this.uploadInProgress.set(true);

    const formData: FormData = new FormData();
    formData.append('certificate', file);

    this.client
      .delete(deleteUrl)
      .pipe(
        switchMap(() => this.client.post(uploadUrl, formData)),
        tapResponse(
          () => onSuccess(),
          (errorResponse: HttpErrorResponse) =>
            onError(this.createApiErrorCollection(errorResponse))
        ),
        finalize(() => this.uploadInProgress.set(false))
      )
      .subscribe();
  }

  public generateClientSecret({
    actorId,
    onSuccess,
    onError,
  }: {
    actorId: string;
    onSuccess: () => void;
    onError: () => void;
  }) {
    const deleteUrl = this.removeCertificateCredentialsUrl();

    if (!deleteUrl || this.generateSecretInProgress()) {
      return;
    }

    this.generateSecretInProgress.set(true);

    let kickOff$ = of('noop');

    if (this.doesClientSecretMetadataExist() || this.doesCertificateExist()) {
      kickOff$ = this.client.delete(deleteUrl).pipe(map(() => 'noop'));
    }

    return kickOff$
      .pipe(
        switchMap(() =>
          this.requestClientSecretCredentials.mutate({ variables: { input: { actorId } } })
        ),
        tapResponse(
          (clientSecret) => {
            if (clientSecret.error) return onError();

            this.clientSecret.set(
              clientSecret.data?.requestClientSecretCredentials.actorClientSecretDto?.secretText
            );

            onSuccess();
          },
          () => onError()
        ),
        finalize(() => this.generateSecretInProgress.set(false))
      )
      .subscribe();
  }

  public resetClientSecret(): void {
    this.clientSecret.set(undefined);
  }

  public removeActorCredentials({
    onSuccess,
    onError,
  }: {
    onSuccess: () => void;
    onError: () => void;
  }): void {
    const removeUrl = this.removeCertificateCredentialsUrl();

    if (!removeUrl) return;

    this.removeInProgress.set(true);

    this.client
      .delete(removeUrl)
      .pipe(
        tapResponse(
          () => {
            this.clientSecret.set(undefined);
            this.actorCredentialQuery.refetch();

            onSuccess();
          },
          () => onError()
        ),
        finalize(() => this.removeInProgress.set(false))
      )
      .subscribe();
  }

  private createApiErrorCollection = (errorResponse: HttpErrorResponse): ApiErrorCollection => {
    return { apiErrors: errorResponse.error?.errors ?? [] };
  };
}
