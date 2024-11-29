import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WattPhoneFieldIntlService {
  readonly changes: Subject<void> = new Subject<void>();
  invalidPhoneNumber = 'Invalid phone number';
  DK = 'Denmark';
  DE = 'Germany';
  FI = 'Finland';
  NO = 'Norway';
  SE = 'Sweden';
  PL = 'Poland';
}
