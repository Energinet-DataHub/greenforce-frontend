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
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { DisplayLanguage, EovAuthService } from '@energinet-datahub/eov/shared/services';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { TranslocoService } from '@ngneat/transloco';
import { ContactComponent, LoginOverlayComponent } from '@energinet-datahub/eov/shared/feature-login';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    OverlayModule,
    NgIf,
    AsyncPipe,
    WattButtonComponent,
    ContactComponent,
    LoginOverlayComponent,
  ],
  selector: 'eov-shell',
  styleUrls: ['./eov-shell.component.scss'],
  templateUrl: './eov-shell.component.html',
})
export class EovShellComponent implements OnInit {
  authService = inject(EovAuthService);
  modalService = inject(WattModalService);
  translocoService = inject(TranslocoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  scrollUp = false;
  scrollDown = false;
  lastScroll = 0;
  isLoginOverlayOpen = false;
  showBanner = false;
  isLoggedIn$ = this.authService.hasTokenObservable();
  activeLanguage?: string;
  isMenuOverlayOpen = false;

  ngOnInit(): void {
    this.setActiveLanguageString();
  }

  isLoginOverlayOpenChanged(isOpen: boolean) {
    this.isLoginOverlayOpen = isOpen;
  }

  openLoginOverlay() {
    this.isLoginOverlayOpen = true;
  }

  navigateToHelp() {
    this.isMenuOverlayOpen = false;
    this.router.navigateByUrl('help');
  }

  openContactInfo() {
    this.isMenuOverlayOpen = false;
    this.modalService.open({component: ContactComponent});
  }

  changeLanguage() {
    this.isMenuOverlayOpen = false;
    this.translocoService.setActiveLang(this.translocoService.getActiveLang() === DisplayLanguage.Danish ? DisplayLanguage.English : DisplayLanguage.Danish);
    this.setActiveLanguageString();
  }

  setActiveLanguageString(): void {
    this.activeLanguage = this.translocoService.getActiveLang() === DisplayLanguage.Danish ? "English" : "Dansk";
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('window:scroll')
  handleStickyTopMenu() {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 68) {
      this.scrollUp = false;
      this.scrollDown = false;
      return;
    }

    if (currentScroll - this.lastScroll >= 0) {
        this.scrollDown = true;
        this.scrollUp = false;
    } else {
        this.scrollDown = false;
        this.scrollUp = true;
    }

    this.lastScroll = currentScroll;

    this.reveal();
  }

  handleLogoClick() {
    if (this.authService.hasToken()) {
      this.router.navigate(['overview']);
      return;
    }
    if (this.isLandingPage()) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      return;
    }
    this.router.navigate(['']);
  }

  isLandingPage() {
    return this.router.url === '/';
  }

  reveal() {
    const reveals = document.querySelectorAll(".reveal");

    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }
}
