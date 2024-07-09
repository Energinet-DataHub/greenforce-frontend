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
import { Component, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { TranslocoPipe } from '@ngneat/transloco';

import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { translations } from '@energinet-datahub/eo/translations';
import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';

@Component({
  standalone: true,
  imports: [MarkdownComponent, WattEmptyStateComponent, TranslocoPipe],
  encapsulation: ViewEncapsulation.None,
  styles: `
    .markdown {
      h2 {
        margin-top: var(--watt-space-l);
      }

      h3 {
        margin-top: var(--watt-space-m);
      }

      p {
        margin-top: var(--watt-space-s);
      }

      :not(pre) > code {
        padding: var(--watt-space-xs) var(--watt-space-s);
        margin: 0;
        font-size: 85%;
        white-space: break-spaces;
        background-color: rgba(175, 184, 193, 0.2);
        border-radius: 6px;
      }
    }

    .markdown-error-container {
      width: 100%;
      height: calc(100vh - 64px /* topbar */ - 32px /* padding */);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
  template: `
    <markdown
      class="markdown"
      markdown
      mermaid
      [src]="doc"
      (ready)="onReady()"
      (error)="onError()" />

    @if(hasError()) {
      <div class="markdown-error-container">
        <watt-empty-state
          icon="custom-power"
          [title]="translations.documentation.error.title | transloco"
          [message]="translations.documentation.error.message | transloco"
        />
      </div>
    }
  `,
})
export class EoMarkdownComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private docs  = inject(eoApiEnvironmentToken).documentation;
  protected hasError = signal<boolean>(false);
  protected translations = translations;

  protected doc: string | undefined;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.doc = this.docs.find((doc) => doc.id === params['doc-id'])?.src;
    });
  }

  onReady() {
    this.hasError.set(false);
  }

  onError() {
    this.hasError.set(true);
  }
}
