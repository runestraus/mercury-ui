import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DpmlComponent } from './dpml.component';
import { DomainComponent } from '../domain/domain.component';
import { PremiumNameComponent } from '../premium-name/premium-name.component';
import { ReservedNameComponent } from '../reserved-name/reserved-name.component';
import { NO_ERRORS_SCHEMA, DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DpmlComponent', () => {
  let component: DpmlComponent;
  let fixture: ComponentFixture<DpmlComponent>;
  let deTable, deLabel: DebugElement;
  let elTable, elLabel: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpmlComponent, DomainComponent, PremiumNameComponent, ReservedNameComponent ],
      schemas:      [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deTable = fixture.debugElement.query(By.css('#dpmlTable'));
    deLabel = fixture.debugElement.query(By.css('#Label'));

    elTable = deTable.nativeElement;
    elLabel = deLabel.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table and have one field: Label.', () => {
    expect(elTable).toBeTruthy();
    expect(elLabel).toBeTruthy();
  });
});
