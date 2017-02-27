/* tslint:disable:no-unused-variable */
import {Location} from '@angular/common';
import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from "@angular/router";
import { routes, AppRoutingModule } from './app-routing.module';
import { TldsIndexComponent } from './tlds/tlds-index/tlds-index.component';
import { TldsCreateComponent } from './tlds/tlds-create/tlds-create.component';
import { SearchComponent } from './search/search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('Router: App', () => {

  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [
        DashboardComponent,
        SearchComponent,
        TldsIndexComponent,
        TldsCreateComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(AppRoutingModule);
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

  it('navigate to "" redirects you to /home', fakeAsync(() => {
    router.navigate(['']);
    tick(50);
    expect(location.path()).toBe('/');
  }));

  it('navigate to "search" takes you to /tlds', fakeAsync(() => {
    router.navigate(['/search']);
    tick(50);
    expect(location.path()).toBe('/tlds');
  }));
});