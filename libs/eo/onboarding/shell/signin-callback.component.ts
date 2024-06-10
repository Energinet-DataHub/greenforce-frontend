import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'eo-signin-callback',
  template: `<p>Processing signin callback</p>`,
  styles: '',
  standalone: true,
  imports: [],
})
export class EoSigninCallbackComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.authService.init();
    this.authService.userManager?.signinCallback().then(user => {
      const clientId = user?.state;
      console.log('client-id:', clientId);

      // ... rest of your code ...

      this.authService.getUser().then(user => {
        console.log('User:', user);
      });
    }).catch(err => {
      console.error('Error processing signin callback:', err);
    });
  }
}
