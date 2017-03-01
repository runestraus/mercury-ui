/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MenuComponent } from './menu.component';
import { FormsModule } from '@angular/forms';
import { MeService } from '../service/me.service';
import 'rxjs/add/operator/toPromise';
import {User} from '../model/user.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
   };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [ MenuComponent ],
    imports: [FormsModule],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('active should be false', () => {
    expect(component.isActive).toBe(false);
  });

  xit('expand menu', () => {
    expect(component.isActive).toBeFalsy();
    fixture.debugElement.query(By.css('span')).nativeElement.toggleButton.click();
    expect(component.isActive).toBeTruthy();
    console.log(fixture.debugElement.query(By.css('span')).nativeElement);
  });
});
