import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EovLandingPageShellComponent } from '@energinet-datahub/eov/landing-page/shell';
import { EovCoreFeatureHelpComponent, EovCoreFeatureHelpContactComponent } from '@energinet-datahub/eov/core/feature-help';
import { DisplayLanguage, EovAuthService } from '@energinet-datahub/eov/shared/services';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    OverlayModule,
    NgIf,
    AsyncPipe,
    WattButtonComponent,
    EovCoreFeatureHelpComponent,
    EovCoreFeatureHelpContactComponent,
  ],
  selector: 'eov-shell',
  styleUrls: ['./eov-shell.component.scss'],
  template: `
      <header>
        <div class="container">
          <div class="container__content areas">
            <div></div>
            <div class="areas__end">
              <a routerLink="help" routerLinkActive="active-link">Hjælp</a>
              <a (click)="openContactInfo()">Kontakt</a>
              <a (click)="changeLanguage()">{{ activeLanguage }}</a>
            </div>
          </div>
      </div>
    </header>
    <nav [class.scroll-up]="scrollUp" [class.scroll-down]="scrollDown">
      <div class="container">
        <div class="container__content areas">
          <div class="areas__start">
            <img src="/assets/images/logo.svg" class="mobile-nav logo" (click)="handleLogoClick()">
            <a href="#datadeling">Datadeling</a>
          </div>
          <div class="areas__end">
            <span (click)="showBanner = !showBanner" class="button">Driftinfo</span>
            <ng-container *ngIf="(isLoggedIn$ | async) === false">
              <span #logonButton class="mobile-nav button" (click)="isOpen = !isOpen" cdkOverlayOrigin #trigger="cdkOverlayOrigin">Log på</span>
              <ng-template
              cdkConnectedOverlay
              [cdkConnectedOverlayOrigin]="trigger"
              [cdkConnectedOverlayOpen]="isOpen"
              [cdkConnectedOverlayPositions]="loginOverlayPosition"
              [cdkConnectedOverlayHasBackdrop]="true"
              (backdropClick)="isOpen = false"
              (detach)="isOpen = false"
              cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
              >
              <ul class="login-overlay mat-elevation-z8">
                <li><watt-button variant="text" (click)="loginAsCustomer()">Privat</watt-button></li>
                <li><watt-button variant="text" (click)="loginAsCorp()">Erhverv</watt-button></li>
                <li><watt-button variant="text" (click)="loginAsThirdParty()">Tredjepart</watt-button></li>
              </ul>
            </ng-template>
          </ng-container>
          <span class="mobile-nav button" (click)="logout()" *ngIf="isLoggedIn$ | async">Log af</span>
            <img src="/assets/images/hamburger.png" class="mobile-nav mobile-only hamburger button" (click)="isHamburgerOpen = !isHamburgerOpen" cdkOverlayOrigin #hamburgerTrigger="cdkOverlayOrigin">
            <ng-template
              cdkConnectedOverlay
              [cdkConnectedOverlayOrigin]="hamburgerTrigger"
              [cdkConnectedOverlayOpen]="isHamburgerOpen"
            >
              <div class="hamburger-overlay">
                <span (click)="isHamburgerOpen = false" class="close-icon"></span>
                <img src="/assets/images/logo.svg" class="logo"/>
                <div class="login-menu">
                  <h2>LOG PÅ</h2>
                  <ul class="login-items">
                    <li><watt-button variant="text" (click)="loginAsCustomer()">Privat</watt-button></li>
                    <li><watt-button variant="text" (click)="loginAsCorp()">Erhverv</watt-button></li>
                    <li><watt-button variant="text" (click)="loginAsThirdParty()">Tredjepart</watt-button></li>
                  </ul>
                </div>
                <div class="bottom-menu">
                  <span>Hjælp</span>
                  <span>Kontakt</span>
                  <span>English</span>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
        <div class="container__full-width container" *ngIf="showBanner">
          <div class="container__content system-info-banner">
            <p><strong>Driftsinfo: </strong>I forbindelse med en opdatering på DataHub vil der ikke være adgang til ElOverblik og tredjepartsløsningen onsdag den 6. december fra kl. 18:00 til 23:00.</p>
          </div>
        </div>
      </div>
    </nav>
    <router-outlet />
    <footer>
      <div class="container">
        <div class="container__content">
          <div>
            ELOVERBLIK LEVERES AF<br><br>
            <img src="/assets/images/energinet.png"><br><br>
            ElOverblik er en platform, der er tilgængelig for privatpersoner, erhvervsdrivende og tredjeparter. Formålet med platformen er at levere data vedr. elforbrug og -produktion, så du som kunde kan få et samlet overblik på tværs af landet og på tværs af elleverandører.
          </div>
          <ul>
            <li>ENERGINET</li>
            <li>DATAHUB</li>
            <li>KONTAKT</li>
            <li>TILGÆNGELIGHEDSERKLÆRING</li>
            <li>PRIVATLIVSPOLITIK</li>
            <li>PERSONDATA</li>
          </ul>
          <div class="address">
            <span>
              ADRESSE<br>
              Tonne Kjærsvej 65<br>
              7000 Fredericia<br>
              Danmark<br>
            </span>
          </div>
        </div>
      </div>
    </footer>
    `,
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
  isOpen = false;
  isHamburgerOpen = false;
  showBanner = false;
  meteringPoints = '';
  loginOverlayPosition: ConnectedPosition[] = [{
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
  }]
  isLoggedIn$ = this.authService.hasTokenObservable();
  activeLanguage?: string;

  ngOnInit(): void {
    this.setActiveLanguageString();
  }

  setActiveLanguageString(): void {
    this.activeLanguage = this.translocoService.getActiveLang() === DisplayLanguage.Danish ? "English" : "Dansk";
  }

  loginAsCustomer() {
   this.authService.loginAsCustomer();
  }

  loginAsCorp() {
    this.authService.loginAsCorp();
  }

  loginAsThirdParty() {
    this.authService.loginAsThirdParty();
  }

  logout() {
    this.authService.logout();
  }

  openContactInfo() {
    this.modalService.open({component: EovCoreFeatureHelpContactComponent});
  }

  changeLanguage() {
    this.translocoService.setActiveLang(this.translocoService.getActiveLang() === DisplayLanguage.Danish ? DisplayLanguage.English : DisplayLanguage.Danish);
    this.setActiveLanguageString();
  }

  @HostListener('window:scroll')
  handleStickyTopMenu() {
    const currentScroll = window.pageYOffset;
    this.isOpen = false
    this.isHamburgerOpen = false;
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
    if (this.route.component === EovLandingPageShellComponent) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      return;
    }
    this.router.navigate(['']);
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
