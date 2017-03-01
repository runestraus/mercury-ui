import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { SessionService } from '../service/session.service';
import { NavbarComponent } from './navbar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { Profile } from '../model/profile.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let page: Page;
  const mockSessionService = {
    getUserProfile: jasmine.createSpy('sessionService.getUserProfile'),
    logOut: jasmine.createSpy('sessionService.logOut')
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
    const profile = new Profile();
    profile.email = 'test@donuts.email';
    profile.name = 'Donny Donuts';
    profile.picture = 'http://donuts.co';
    mockSessionService.getUserProfile.and.returnValue(profile);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
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
    expect(mockSessionService.logOut).toHaveBeenCalled();
  });

  class Page {
    logoutBtn = fixture.debugElement.query(By.css('#logout')).nativeElement;
    logoutMenuBtn = fixture.debugElement.query(By.css('#logout-menu')).nativeElement;
    constructor() {}
  }
});
