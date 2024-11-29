import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DhProfileModalService {
  private profileUpdateSubject = new Subject<void>();

  public onProfileUpdate$ = this.profileUpdateSubject.asObservable();

  public notifyAboutProfileUpdate(): void {
    this.profileUpdateSubject.next();
  }
}
