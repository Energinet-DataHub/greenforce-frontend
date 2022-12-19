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

import { ActorTokenService } from './actor-token.service';
import {
  MarketParticipantUserHttp,
  TokenHttp,
} from '@energinet-datahub/dh/shared/domain';
import {
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { ActorStorage } from './actor-storage';
import { LocalStorageFake } from '@energinet-datahub/dh/shared/test-util-auth';

describe(ActorTokenService.name, () => {
  const createActorsRequest = () =>
    new HttpRequest<string>(
      'GET',
      'https://localhost:5000/v1/MarketParticipantUser/Actors',
      {
        headers: new HttpHeaders({ Authorization: 'Bearer xyz' }),
      }
    );

  test('should return true if request is for getting actors', async () => {
    // arrange
    const request = createActorsRequest();

    const target = new ActorTokenService(
      {} as MarketParticipantUserHttp,
      {} as TokenHttp,
      new ActorStorage(new LocalStorageFake())
    );

    // act
    const actual = target.isPartOfAuthFlow(request);

    // assert
    expect(actual).toEqual(true);
  });

  test('should return true if request is for getting token', async () => {
    // arrange
    const request = new HttpRequest<string>(
      'GET',
      'https://localhost:5000/v1/Token'
    );

    const target = new ActorTokenService(
      {} as MarketParticipantUserHttp,
      {} as TokenHttp,
      new ActorStorage(new LocalStorageFake())
    );

    // act
    const actual = target.isPartOfAuthFlow(request);

    // assert
    expect(actual).toEqual(true);
  });

  test('should return false if request is not for authentication flow', async () => {
    // arrange
    const request = new HttpRequest<string>(
      'GET',
      'https://localhost:5000/v1/Not/Relevant'
    );

    const target = new ActorTokenService(
      {} as MarketParticipantUserHttp,
      {} as TokenHttp,
      new ActorStorage(new LocalStorageFake())
    );

    // act
    const actual = target.isPartOfAuthFlow(request);

    // assert
    expect(actual).toEqual(false);
  });

  test('should return false if request is not for internal authentication flow', async () => {
    // arrange
    const request = new HttpRequest<string>(
      'GET',
      'https://dev002datahubb2c.b2clogin.com/dev002datahubb2c.onmicrosoft.com/b2c_some_policy/oauth2/v2.0/token'
    );

    const target = new ActorTokenService(
      {} as MarketParticipantUserHttp,
      {} as TokenHttp,
      new ActorStorage(new LocalStorageFake())
    );

    // act
    const actual = target.isPartOfAuthFlow(request);

    // assert
    expect(actual).toEqual(false);
  });

  test('should call endpoint when cache is empty', async () => {
    // arrange
    const response = new HttpResponse<string>({
      status: 200,
      body: 'response',
    });
    const request = createActorsRequest();

    const handler: HttpHandler = {
      handle: jest.fn(() => of(response)),
    };

    const target = new ActorTokenService(
      {} as MarketParticipantUserHttp,
      {} as TokenHttp,
      new ActorStorage(new LocalStorageFake())
    );

    // act
    const actual = (await firstValueFrom(
      target.handleAuthFlow(request, handler)
    )) as HttpResponse<string>;

    // assert
    expect(actual.body).toEqual(response.body);
    expect(handler.handle).toBeCalledTimes(1);
  });

  test('should not call endpoint when cache is current', async () => {
    // arrange
    const response = new HttpResponse<string>({
      status: 200,
      body: 'response',
    });
    const request = createActorsRequest();

    const handler: HttpHandler = {
      handle: jest.fn(() => of(response)),
    };

    const target = new ActorTokenService(
      {} as MarketParticipantUserHttp,
      {} as TokenHttp,
      new ActorStorage(new LocalStorageFake())
    );

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
    expect(handler.handle).toBeCalledTimes(1);
  });

  test('should call endpoint when cache is invalidated', async () => {
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
      'https://localhost:5000/v1/MarketParticipantUser/Actors',
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

    const target = new ActorTokenService(
      {} as MarketParticipantUserHttp,
      {} as TokenHttp,
      new ActorStorage(new LocalStorageFake())
    );

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
    expect(handlerA.handle).toBeCalledTimes(1);
    expect(handlerB.handle).toBeCalledTimes(1);
  });
});
