/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {SessionService} from '../service/session.service';
import {Subject} from 'rxjs/Subject';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const loggedIn$ = new Subject<string>();
  const mockSessionService = {
    initOauthFlow: jasmine.createSpy('initImplicitFlow'),
    loginObservable: () => {
      return loggedIn$.asObservable();
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: mockSessionService }],
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('login() should call sessionService', async(() => {
    component.login();
    expect(mockSessionService.initOauthFlow).toHaveBeenCalled();
  }));
});
