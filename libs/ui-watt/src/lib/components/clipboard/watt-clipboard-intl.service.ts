import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WattClipboardIntlService {
  success = 'Copied to clipboard';
  error = 'Failed to copy';
}
