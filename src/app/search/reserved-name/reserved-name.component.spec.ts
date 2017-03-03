import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservedNameComponent } from './reserved-name.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ReservedNameComponent', () => {
  let component: ReservedNameComponent;
  let fixture: ComponentFixture<ReservedNameComponent>;
  let deTable, deName, deTags: DebugElement;
  let elTable, elName, elTags: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservedNameComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservedNameComponent);
    component = fixture.componentInstance;
    deTable = fixture.debugElement.query(By.css('#reservedNamesTable'));
    deName = fixture.debugElement.query(By.css('#reservedDomainName'));
    deTags = fixture.debugElement.query(By.css('#reservedDomainTags'));

    elTable = deTable.nativeElement;
    elName = deName.nativeElement;
    elTags = deTags.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table and have two fields: Domain and Tags.', () => {
    expect(elTable).toBeTruthy();
    expect(elName).toBeTruthy();
    expect(elTags).toBeTruthy();
  });
});
