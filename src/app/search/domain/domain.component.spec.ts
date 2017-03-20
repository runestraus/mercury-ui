import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { DomainComponent } from './domain.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DomainComponent', () => {
  let component: DomainComponent;
  let fixture: ComponentFixture<DomainComponent>;
  let deTable, deName, deTld, deStatus, deSystemTags, dePrice, deCategory, deIanaNumber, deRegistrarName: DebugElement;
  let elTable, elName, elTld, elStatus, elSystemTags, elPrice, elCategory, elIanaNumber, elRegistrarName: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deTable = fixture.debugElement.query(By.css('#domainsTable'));
    deName = fixture.debugElement.query(By.css('#domainName'));
    deTld = fixture.debugElement.query(By.css('#tld'));
    deStatus = fixture.debugElement.query(By.css('#status'));
    deSystemTags = fixture.debugElement.query(By.css('#systemTags'));
    dePrice = fixture.debugElement.query(By.css('#price'));
    deCategory = fixture.debugElement.query(By.css('#category'));
    deIanaNumber = fixture.debugElement.query(By.css('#ianaNumber'));
    deRegistrarName = fixture.debugElement.query(By.css('#registrarName'));

    elTable = deTable.nativeElement;
    elName = deName.nativeElement;
    elTld = deTld.nativeElement;
    elStatus = deStatus.nativeElement;
    elSystemTags = deSystemTags.nativeElement;
    elPrice = dePrice.nativeElement;
    elCategory = deCategory.nativeElement;
    elIanaNumber = deIanaNumber.nativeElement;
    elRegistrarName = deRegistrarName.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table and have eight fields: DomainName, tld, status, System Tags, Price, Category, ' +
    'Iana Number and Registrar.', () => {
    expect(elTable).toBeTruthy();
    expect(elName).toBeTruthy();
    expect(elTld).toBeTruthy();
    expect(elStatus).toBeTruthy();
    expect(elSystemTags).toBeTruthy();
    expect(elPrice).toBeTruthy();
    expect(elCategory).toBeTruthy();
    expect(elIanaNumber).toBeTruthy();
    expect(elRegistrarName).toBeTruthy();
  });
});
