import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SessionService } from './service/session.service';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const mockSessionService = {
    onSignIn: jasmine.createSpy('onSignIn'),
    initialize: jasmine.createSpy('initialize'),
    onSignedOut: jasmine.createSpy('onSignedOut')
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: SessionService, useValue: mockSessionService},
        {provide: Router, useValue: mockRouter}],
      declarations: [ AppComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});

