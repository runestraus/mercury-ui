/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MenuComponent } from './menu.component';
import { FormsModule } from '@angular/forms';
import { MeService } from '../service/me.service';
import 'rxjs/add/operator/toPromise';
import { HttpModule } from '@angular/http';
import {User} from '../model/user.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '../shared/http.client';
import { OAuthService } from 'angular-oauth2-oidc';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
   };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [ MenuComponent ],
    imports: [ FormsModule, HttpModule ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
    providers: [ HttpClient, OAuthService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('active should be false', () => {
    expect(component.isActive).toBeFalsy;
  });

  it('expand menu', () => {
    expect(component.isActive).toBeFalsy();
    fixture.debugElement.query(By.css('span')).nativeElement.click();
    expect(component.isActive).toBeTruthy;
  });
});
