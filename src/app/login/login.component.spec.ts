/* tslint:disable:no-unused-variable */
import { async, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { SessionService } from '../service/session.service';
import { By } from '@angular/platform-browser';
import { AbstractMockObservableService } from '../service/testing/abstract-mock-observable-service.test';

describe('LoginComponent', () => {
  let mockSessionService;

  class MockSessionService extends AbstractMockObservableService {
    loginObservable() {
      return this;
    }

    initOauthFlow() {}
  }

  beforeEach(async(() => {
    mockSessionService = new MockSessionService();
    spyOn(mockSessionService, 'initOauthFlow');
    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: mockSessionService }],
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
  });

  it('clicking google login should login using session service', async(() => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#google-login')).nativeElement.click();
    expect(mockSessionService.initOauthFlow).toHaveBeenCalled();
  }));

  it('should show an error message if login failed', () => {
    mockSessionService.error = 'its an error';
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
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
    expect(component.loginFailed).toBeFalsy();
    expect(fixture.debugElement.query(By.css('#login-error'))).toBeNull();
  });
});
