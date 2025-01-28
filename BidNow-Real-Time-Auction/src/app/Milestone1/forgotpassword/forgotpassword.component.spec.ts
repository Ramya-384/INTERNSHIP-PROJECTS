import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgotpassword.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error for invalid email', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    component.email = 'invalidemail';
    component.onSubmit({ valid: false } as any);
    fixture.detectChanges();
    expect(compiled.querySelector('.error')?.textContent).toContain('Enter a valid email address');
  });
});