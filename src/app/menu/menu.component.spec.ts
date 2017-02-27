/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
let component: MenuComponent;
let fixture: ComponentFixture<MenuComponent>;
let el: HTMLElement;

beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [ MenuComponent ]
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
    expect(component.isActive).toBeFalsy();
});

it('expand menu', () => {
    component.isActive = true;
    fixture.detectChanges();
    expect(component.isActive).toBeTruthy();
});
});