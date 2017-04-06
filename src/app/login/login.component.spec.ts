/* tslint:disable:no-unused-variable */
import { async, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { SessionService } from '../service/session.service';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let signInFunc;
  const mockSessionService = {
    onSignInFailure: (fn: () => void) => {
      signInFunc = fn;
    },
    signIn: jasmine.createSpy('sessionService.signIn')
  };

  beforeEach(async(() => {
    spyOn(mockSessionService, 'onSignInFailure');
    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: mockSessionService }],
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  }));

  it('clicking google login should login using session service', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#google-login')).nativeElement.click();
    expect(mockSessionService.signIn).toHaveBeenCalled();
    expect(mockSessionService.onSignInFailure).toHaveBeenCalled();
  });

  it('should show an error message if login failed', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    component.loginFailed = true;
    fixture.detectChanges();
    const loginError = fixture.debugElement.query(By.css('#login-error')).nativeElement;
    expect(component.loginFailed).toBeTruthy();
    expect(loginError.textContent)
      .toBe('You are not authorized to access this application.');
  });

  it('should not show an error when login is successful', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.loginFailed).toBeFalsy();
      expect(fixture.debugElement.query(By.css('#login-error'))).toBeNull();
    });
  });
});
