import { TestBed } from '@angular/core/testing';

import { DrawerDatepickerService } from './drawer-datepicker.service';

describe('DrawerDatepickerServiceService', () => {
  let service: DrawerDatepickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawerDatepickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
