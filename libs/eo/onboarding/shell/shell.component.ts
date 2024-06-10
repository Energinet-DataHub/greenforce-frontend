import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { AuthService } from "./auth.service";

@Component({
  standalone: true,
  selector: 'eo-onboarding-shell',
  template: `Onboarding Shell Component`,
})
export class EoOnboardingShellComponent implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  clientId: string | null = null;

  ngOnInit() {
    this.auth.init(
      this.route.snapshot.queryParamMap.get('client-id')
    );
    this.auth.login().catch(err => {
      console.error('Error logging in:', err);
    });
  }
}
