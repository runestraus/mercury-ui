/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MenuComponent } from './menu.component';
import 'rxjs/add/operator/toPromise';
import { User } from '../../model/user.model';
import { CanDirective } from '../../shared/directives/can.directive';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuComponent, CanDirective ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [ ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const user = new User();
    user.email = 'test@donuts.email';
    user.clientId = 'brodaddy';
    user.isRegistrarLogin = true;
    user.permissions = ['CRU_REGISTRY_ADMIN'];
    user.ianaId = 9999;
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    component.user = user;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('active should be false', () => {
    expect(component.isActive).toBeFalsy();
  });

  it('expand menu', () => {
    expect(component.isActive).toBeFalsy();
    fixture.debugElement.query(By.css('span')).nativeElement.click();
    expect(component.isActive).toBeTruthy();
  });
});
