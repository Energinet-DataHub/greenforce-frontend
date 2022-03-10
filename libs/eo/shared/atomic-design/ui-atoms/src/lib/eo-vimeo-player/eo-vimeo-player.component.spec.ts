import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EoVimeoPlayerComponent } from './eo-vimeo-player.component';

describe(EoVimeoPlayerComponent.name, () => {
  let component: EoVimeoPlayerComponent;
  let fixture: ComponentFixture<EoVimeoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EoVimeoPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EoVimeoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
