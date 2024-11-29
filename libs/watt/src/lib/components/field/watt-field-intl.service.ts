import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WattFieldIntlService {
  readonly changes: Subject<void> = new Subject<void>();
  required = 'Field is required';
}
