/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Location, CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, inject, async } from '@angular/core/testing';
import { AppRoutingModule } from './app-routing.module';
import { TldsIndexComponent } from './tlds/tlds-index/tlds-index.component';

@Component({
  template: `
    <a routerLink="/tlds" routerLinkActive="active"><i class="fa fa-gear fa-fw"></i>TLDs</a>
    <router-outlet></router-outlet>
  `
})
class TestComponent {
}

@Component({
  template: ''
})
class DummyComponent {
}

describe('component: TestComponent', function () {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([
         { path: 'tlds', component: DummyComponent }
        ])
      ],
      declarations: [ TestComponent, DummyComponent ]
    });
  });

  it('should go to /tlds',
    async(inject([Router, Location], (router: Router, location: Location) => {
    let fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('a')).nativeElement.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual('/tlds');
      console.log('location.path()) is ' + location.path());
    });
  })));
});

/*import { Location } from "@angular/common";
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { routes } from './app-routing.module';
import { SearchComponent } from './search/search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TldsIndexComponent } from './tlds/tlds-index/tlds-index.component';
import { TldsCreateComponent } from './tlds/tlds-create/tlds-create.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SessionService } from './service/session.service';
import { Component } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
  template: `
    <a routerLink="/tlds">link</a>
    <router-outlet></router-outlet>
  `
})
class TldsComponent{}

describe('Router: App', () => {

  let location: Location;
  let router: Router;
  let fixture;

  const mockSessionService = {
    isLoggedIn: jasmine.createSpy('isLoggedIn'),
    initialize: jasmine.createSpy('initialize')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: SessionService, useValue: mockSessionService}],
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [
        SearchComponent,
        DashboardComponent,
        TldsIndexComponent,
        TldsCreateComponent,
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  });

  it('fakeAsync works', fakeAsync(() => {
    let promise = new Promise((resolve) => {
      setTimeout(resolve, 10)
    });
    let done = false;
    promise.then(() => done = true);
    tick(50);
    expect(done).toBeTruthy();
  }));

  it('navigate to "tlds" takes you to /tlds', fakeAsync(() => {
    router.navigate(['/tlds']);
    tick(50);
    console.log('location.path()) is ' + location.path());
   // expect(location.path()).toBe('/search');
  }));
});*/
