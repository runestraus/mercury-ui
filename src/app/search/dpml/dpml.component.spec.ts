import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpmlComponent } from './dpml.component';
import { DomainComponent } from '../domain/domain.component';
import { PremiumNameComponent } from '../premium-name/premium-name.component';
import { ReservedNameComponent } from '../reserved-name/reserved-name.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DpmlComponent', () => {
  let component: DpmlComponent;
  let fixture: ComponentFixture<DpmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpmlComponent, DomainComponent, PremiumNameComponent, ReservedNameComponent ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
