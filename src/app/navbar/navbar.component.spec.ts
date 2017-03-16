import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { SessionService } from '../service/session.service';
import { NavbarComponent } from './navbar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { UserData } from '../model/profile.model';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let page: Page;
  const mockSessionService = {
    signOut: jasmine.createSpy('sessionService.logOut')
  };
  const profile = {
    'getEmail': () => 'test@donuts.email',
    getName: () => 'Donny Donuts',
    getImageUrl: () => 'http://donuts.co'
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [{ provide: SessionService, useValue: mockSessionService},
        { provide: Router, useValue: mockRouter } ],
      declarations: [ NavbarComponent, SearchBarComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    component.userInfo = {
      profile: profile,
      user: null
    } as UserData;
    fixture.detectChanges();
    page = new Page();
  });

  it('openMenu() should set the menuOpen to true', () => {
    expect(component.menuOpen).toBeFalsy();
    page.logoutMenuBtn.click();
    expect(component.menuOpen).toBeTruthy();
  });

  it('should call logout on Logout click', () => {
    page.logoutBtn.click();
    expect(mockSessionService.signOut).toHaveBeenCalled();
  });

  class Page {
    logoutBtn = fixture.debugElement.query(By.css('#logout')).nativeElement;
    logoutMenuBtn = fixture.debugElement.query(By.css('#logout-menu')).nativeElement;
    constructor() {}
  }
});
