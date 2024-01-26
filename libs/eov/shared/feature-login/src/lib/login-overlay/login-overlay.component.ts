import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayLanguage, EovAuthService } from '@energinet-datahub/eov/shared/services';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalService } from '@energinet-datahub/watt/modal';
import { TranslocoService } from '@ngneat/transloco';
import { ContactComponent } from '../contact/contact.component';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'eov-login-overlay',
  standalone: true,
  imports: [
    CommonModule,
    WattButtonComponent,
    OverlayModule,
    MatRippleModule,
  ],
  templateUrl: './login-overlay.component.html',
  styleUrl: './login-overlay.component.scss',
})
export class LoginOverlayComponent implements OnInit {
  router = inject(Router);
  modalService = inject(WattModalService);
  translocoService = inject(TranslocoService);
  authService = inject(EovAuthService);
  activeLanguage?: string;
  @Input() isOverlayOpen!: boolean;
  @Output() isOverlayOpenChange = new EventEmitter<boolean>();
  @Input({ required: true }) trigger!: CdkOverlayOrigin;

  ngOnInit(): void {
    this.setActiveLanguageString();
  }

  navigateToHelp() {
    this.isOverlayOpenChange.emit(false);
    this.router.navigateByUrl('help');
  }

  openContactInfo() {
    this.isOverlayOpenChange.emit(false);
    this.modalService.open({component: ContactComponent});
  }

  changeLanguage() {
    this.isOverlayOpenChange.emit(false);
    this.translocoService.setActiveLang(this.translocoService.getActiveLang() === DisplayLanguage.Danish ? DisplayLanguage.English : DisplayLanguage.Danish);
    this.setActiveLanguageString();
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

  setActiveLanguageString(): void {
    this.activeLanguage = this.translocoService.getActiveLang() === DisplayLanguage.Danish ? "English" : "Dansk";
  }

  closeOverlay() {
    this.isOverlayOpenChange.emit(false)
  }
}
