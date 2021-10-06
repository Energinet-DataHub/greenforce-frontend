import { Inject, Injectable, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { AuthOidcHttp, AuthOidcLoginResponse } from './auth-oidc-http.service';
import { PublicMembers } from './public-members';

export function injectAuthOidcStub(): AuthOidcStub {
  return TestBed.inject(AuthOidcHttp) as unknown as AuthOidcStub;
}

@Injectable()
export class AuthOidcStub implements PublicMembers<AuthOidcHttp> {
  login = jest.fn<Observable<AuthOidcLoginResponse>, [string]>(
    (redirectUri: string): Observable<AuthOidcLoginResponse> => {
      return of({
        url: `${this.authenticationUrl}?redirect_uri=${redirectUri}`,
      });
    }
  );

  constructor(
    @Inject(authenticationUrlToken)
    private authenticationUrl: string | null
  ) {}
}

@NgModule({
  providers: [
    {
      provide: AuthOidcHttp,
      useClass: AuthOidcStub,
    },
  ],
})
export class AuthOidcStubModule {
  static withAuthenticationUrl(
    authenticationUrl: string
  ): ModuleWithProviders<AuthOidcStubModule> {
    return {
      ngModule: AuthOidcStubModule,
      providers: [
        {
          provide: authenticationUrlToken,
          useValue: authenticationUrl,
        },
      ],
    };
  }
}

const authenticationUrlToken = new InjectionToken<string>('redirectUriToken', {
  factory: (): string => 'https://example.com/authentication',
  providedIn: 'root',
});
