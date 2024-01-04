import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { eovApiEnvironmentToken } from '@energinet-datahub/eov/shared/environments';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterModule,
    OverlayModule,
    NgIf,
  ],
  selector: 'eov-shell',
  styleUrls: ['./eov-shell.component.scss'],
  template: `
      <header>
        <div class="container">
          <div class="container__content areas">
            <div></div>
            <div class="areas__end">
              <span>Hjælp</span>
              <span>Kontakt</span>
              <span>English</span>
            </div>
          </div>
      </div>
    </header>
    <nav [class.scroll-up]="scrollUp" [class.scroll-down]="scrollDown">
      <div class="container">
        <div class="container__content areas">
          <div class="areas__start">
            <img src="/assets/images/logo.svg" class="mobile-nav logo" (click)="scrollToTop()">
            <a href="#datadeling">Datadeling</a>
          </div>
          <div class="areas__end">
            <span (click)="showBanner = !showBanner">Driftinfo</span>
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
                <li (click)="loginAsCustomer()">Privat</li>
                <li>Erhverv</li>
                <li>Tredjepart</li>
              </ul>
            </ng-template>
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
                    <li (click)="loginAsCustomer()">Privat</li>
                    <li>Erhverv</li>
                    <li>Tredjepart</li>
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
export class EovShellComponent {
  environment = inject(eovApiEnvironmentToken);
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

  loginAsCustomer() {
    window.location.href =
      `${this.environment.netsBaseURL}/connect/authorize` +
      `?response_type=code&client_id=${this.environment.clientId}` +
      `&prompt=true` +
      `&redirect_uri=${this.environment.customerApiUrl}/api/oidc/callback` +
      `&language=da&scope=mitid+openid+userinfo_token+ssn` +
      `&idp_values=mitid&idp_params=%7B%22mitid%22%3A%7B%22reference_text%22%3A%22TG9naW4gdGlsIEVsT3ZlcmJsaWs%3D%22%7D%7D` +
      `&state=${btoa(JSON.stringify({ webApp: 11, completionUri: 'http://localhost:4200/overview' }))}`;
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

  scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
