/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MenuComponent } from './menu.component';
import { HttpClient } from '../shared/http.client';
import { MeService } from '../service/me.service';
import 'rxjs/add/operator/toPromise';
import {User} from '../model/user.model';

describe('MenuComponent', () => {
let component: MenuComponent;
let fixture: ComponentFixture<MenuComponent>;

beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [ MenuComponent ],
    providers: [HttpClient]
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
    component.isActive = true;
    fixture.detectChanges();
    expect(component.isActive).toBeTruthy();

    fixture.debugElement.query(By.css('span')).nativeElement.click();
    console.log(fixture.debugElement.query(By.css('span')).nativeElement);
});
});
