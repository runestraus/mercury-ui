import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { SessionService } from '../service/session.service';
import { NavbarComponent } from './navbar.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { User } from '../model/user.model';
import { UserData } from '../model/profile.model';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let page: Page;
  const mockSessionService = {
    signOut: jasmine.createSpy('sessionService.logOut')
  };
  const profileEntity = {
    id: '1234',
    name: 'Bobby Brown',
    givenName: 'Bobby',
    familyName: 'Brown',
    imageUrl: '/image/img.jpg',
    email: 'BobbyBrown@donuts.co',
    'getEmail': () => 'test@donuts.email',
    getName: () => 'Donny Donuts',
    getImageUrl: () => 'http://donuts.co'
  };
  const userEntity: User = {
    email: 'BobbyBrown@donuts.co',
    clientId: '1234',
    isRegistrarLogin: true,
    permissions: [],
    ianaId: 9999,
    registrarName: 'Brodaddy',
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
      profile: profileEntity,
      user: userEntity,
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
