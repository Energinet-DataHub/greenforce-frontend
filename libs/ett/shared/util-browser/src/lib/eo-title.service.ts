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
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class EoTitle {
  private titleSubject = new BehaviorSubject<string>('');
  title$!: Observable<string>;

  constructor(private titleService: Title) {
    this.title$ = this.titleSubject.asObservable();
  }

  setTitle(title: string): void {
    // Updates the meta title
    this.titleService.setTitle(title);

    // Notify subscribers of this.#title$
    this.titleSubject.next(title);
  }
}
