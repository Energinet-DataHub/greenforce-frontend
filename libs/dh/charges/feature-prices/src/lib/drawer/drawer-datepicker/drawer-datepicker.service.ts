import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DatePickerData {
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class DrawerDatepickerService {
  dataDefault: DatePickerData = {
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  };

  private dataSource$ = new BehaviorSubject(this.dataDefault);
  data$ = this.dataSource$.asObservable();

  getData() {
    return this.dataDefault;
  }

  setData(data: DatePickerData) {
    this.dataSource$.next(data);
  }
}
