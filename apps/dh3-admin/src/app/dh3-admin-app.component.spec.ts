import { TestBed } from '@angular/core/testing';
import { Dh3AdminAppComponent } from './dh3-admin-app.component';

describe(Dh3AdminAppComponent.name, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Dh3AdminAppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Dh3AdminAppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'dh3-admin'`, () => {
    const fixture = TestBed.createComponent(Dh3AdminAppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('dh3-admin');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(Dh3AdminAppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome to dh3-admin!'
    );
  });
});
