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
import { DhActorTokenService } from './dh-actor-token.service';
import { TestBed } from '@angular/core/testing';
import {
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpResponse,
  provideHttpClient,
} from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';

import { LocalStorageFake, SessionStorageFake } from '@energinet-datahub/gf/test-util';
import { MsalServiceMock } from '@energinet-datahub/dh/shared/test-util';

import { DhActorStorage } from './dh-actor-storage';

describe(DhActorTokenService, () => {
  const createActorsRequest = () =>
    new HttpRequest<string>(
      'GET',
      'https://localhost:5000/v1/MarketParticipantUser/GetUserActors',
      {
        headers: new HttpHeaders({ Authorization: 'Bearer xyz' }),
      }
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MsalServiceMock,
        DhActorStorage,
        LocalStorageFake,
        SessionStorageFake,
        provideHttpClient(),
        provideHttpClient(),
      ],
    });
  });

  test('should return true if request is for getting actors', async () => {
    TestBed.runInInjectionContext(() => {
      // arrange
      const request = createActorsRequest();

      const target = new DhActorTokenService();

      // act
      const actual = target.isPartOfAuthFlow(request);

      // assert
      expect(actual).toEqual(true);
    });
  });

  test('should return true if request is for getting token', async () => {
    TestBed.runInInjectionContext(() => {
      // arrange
      const request = new HttpRequest<string>('GET', 'https://localhost:5000/v1/Token');

      const target = new DhActorTokenService();
      // act
      const actual = target.isPartOfAuthFlow(request);

      // assert
      expect(actual).toEqual(true);
    });
  });

  test('should return false if request is not for authentication flow', async () => {
    TestBed.runInInjectionContext(() => {
      // arrange
      const request = new HttpRequest<string>('GET', 'https://localhost:5000/v1/Not/Relevant');

      const target = new DhActorTokenService();

      // act
      const actual = target.isPartOfAuthFlow(request);

      // assert
      expect(actual).toEqual(false);
    });
  });

  test('should return false if request is not for internal authentication flow', async () => {
    TestBed.runInInjectionContext(() => {
      // arrange
      const request = new HttpRequest<string>(
        'GET',
        'https://b2cshresdevwe002.b2clogin.com/b2cshresdevwe002.onmicrosoft.com/b2c_some_policy/oauth2/v2.0/token'
      );

      const target = new DhActorTokenService();

      // act
      const actual = target.isPartOfAuthFlow(request);

      // assert
      expect(actual).toEqual(false);
    });
  });

  test('should call endpoint when cache is empty', async () => {
    await TestBed.runInInjectionContext(async () => {
      // arrange
      const response = new HttpResponse<string>({
        status: 200,
        body: 'response',
      });
      const request = createActorsRequest();

      const handler: HttpHandler = {
        handle: jest.fn(() => of(response)),
      };

      const target = new DhActorTokenService();

      // act
      const actual = (await firstValueFrom(
        target.handleAuthFlow(request, handler)
      )) as HttpResponse<string>;

      // assert
      expect(actual.body).toEqual(response.body);
      expect(handler.handle).toHaveBeenCalledTimes(1);
    });
  });

  test('should not call endpoint when cache is current', async () => {
    await TestBed.runInInjectionContext(async () => {
      // arrange
      const response = new HttpResponse<string>({
        status: 200,
        body: 'response',
      });
      const request = createActorsRequest();

      const handler: HttpHandler = {
        handle: jest.fn(() => of(response)),
      };

      const target = new DhActorTokenService();

      // act
      const actualA = (await firstValueFrom(
        target.handleAuthFlow(request, handler)
      )) as HttpResponse<string>;
      const actualB = (await firstValueFrom(
        target.handleAuthFlow(request, handler)
      )) as HttpResponse<string>;

      // assert
      expect(actualA.body).toEqual(response.body);
      expect(actualB.body).toEqual(response.body);
      expect(handler.handle).toHaveBeenCalledTimes(1);
    });
  });

  test('should call endpoint when cache is invalidated', async () => {
    await TestBed.runInInjectionContext(async () => {
      // arrange
      const responseA = new HttpResponse<string>({
        status: 200,
        body: 'responseA',
      });
      const responseB = new HttpResponse<string>({
        status: 200,
        body: 'responseB',
      });
      const requestA = createActorsRequest();
      const requestB = new HttpRequest<string>(
        'GET',
        'https://localhost:5000/v1/MarketParticipantUser/GetUserActors',
        {
          headers: new HttpHeaders({ Authorization: 'Bearer abc' }),
        }
      );

      const handlerA: HttpHandler = {
        handle: jest.fn(() => of(responseA)),
      };
      const handlerB: HttpHandler = {
        handle: jest.fn(() => of(responseB)),
      };

      const target = new DhActorTokenService();

      // act
      const actualA = (await firstValueFrom(
        target.handleAuthFlow(requestA, handlerA)
      )) as HttpResponse<string>;
      const actualB = (await firstValueFrom(
        target.handleAuthFlow(requestB, handlerB)
      )) as HttpResponse<string>;

      // assert
      expect(actualA.body).toEqual(responseA.body);
      expect(actualB.body).toEqual(responseB.body);
      expect(handlerA.handle).toHaveBeenCalledTimes(1);
      expect(handlerB.handle).toHaveBeenCalledTimes(1);
    });
  });
});
