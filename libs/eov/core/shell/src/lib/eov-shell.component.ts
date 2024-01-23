import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  templateUrl: './eov-shell.component.html',
})
export class EovShellComponent implements OnInit {
  authService = inject(EovAuthService);
  modalService = inject(WattModalService);
  translocoService = inject(TranslocoService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  showHeader = false;
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
    this.showHeader = !this.isLandingPage();
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

  navigateToHelp() {
    this.isHamburgerOpen = false;
    this.router.navigateByUrl('help');
  }

  openContactInfo() {
    this.isHamburgerOpen = false;
    this.modalService.open({component: EovCoreFeatureHelpContactComponent});
  }

  changeLanguage() {
    this.isHamburgerOpen = false;
    this.translocoService.setActiveLang(this.translocoService.getActiveLang() === DisplayLanguage.Danish ? DisplayLanguage.English : DisplayLanguage.Danish);
    this.setActiveLanguageString();
  }

  @HostListener('window:scroll')
  handleStickyTopMenu() {
    const currentScroll = window.pageYOffset;
    this.isOpen = false
    this.isHamburgerOpen = false;
    if (this.isLandingPage()) {
      if (currentScroll > 100) {
        this.showHeader = true;
      } else {
        this.showHeader = false;
      }
    }
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
