import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhEditUserModalComponentComponent } from './dh-edit-user-modal.component.component';

describe('DhEditUserModalComponentComponent', () => {
  let component: DhEditUserModalComponentComponent;
  let fixture: ComponentFixture<DhEditUserModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DhEditUserModalComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DhEditUserModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
