import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HostComponent } from './host.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let deTable, deName: DebugElement;
  let elTable, elName: HTMLElement;

  const mockRoute = {
    navigate : {}
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostComponent ],
      providers: [
        { provide: Router, useValue: mockRoute }
        ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deTable = fixture.debugElement.query(By.css('#hostsTable'));
    deName = fixture.debugElement.query(By.css('#hostName'));

    elTable = deTable.nativeElement;
    elName = deName.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table and have one field: hostName.', () => {
    expect(elTable).toBeTruthy();
    expect(elName).toBeTruthy();
  });
});
