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
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('a')).nativeElement.click();
    fixture.whenStable().then(() => {
      expect(location.path()).toEqual('/tlds');
      console.log('location.path()) is ' + location.path());
    });
  })));
});
