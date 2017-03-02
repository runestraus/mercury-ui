import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SessionService } from './service/session.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const mockSessionService = {
    isLoggedIn: jasmine.createSpy('isLoggedIn'),
    initialize: jasmine.createSpy('initialize')
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: SessionService, useValue: mockSessionService},
        {provide: Router, useValue: mockRouter}],
      declarations: [ AppComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('isLoggedIn() should call sessionService.isLoggedIn', () => {
    component.isLoggedIn();
    expect(mockSessionService.isLoggedIn).toHaveBeenCalled();
  });

});

