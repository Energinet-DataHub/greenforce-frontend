import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhEditUserModalComponent } from './dh-edit-user-modal.component';

describe('DhEditUserModalComponent', () => {
  let component: DhEditUserModalComponent;
  let fixture: ComponentFixture<DhEditUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DhEditUserModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DhEditUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
