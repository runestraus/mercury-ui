import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PremiumNameComponent } from './premium-name.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PremiumNameComponent', () => {
  let component: PremiumNameComponent;
  let fixture: ComponentFixture<PremiumNameComponent>;
  let deTable, deName, deCategory, dePrice, deFutureCategory, deChangeDate: DebugElement;
  let elTable, elName, elCategory, elPrice, elFutureCategory, elChangeDate: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumNameComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deTable = fixture.debugElement.query(By.css('#premiumPriceTable'));
    deName = fixture.debugElement.query(By.css('#premiumDomainName'));
    deCategory = fixture.debugElement.query(By.css('#premiumDomainCategory'));
    dePrice = fixture.debugElement.query(By.css('#premiumDomainPrice'));
    deFutureCategory = fixture.debugElement.query(By.css('#premiumDomainFutureCategory'));
    deChangeDate = fixture.debugElement.query(By.css('#premiumDomainChangeDate'));

    elTable = deTable.nativeElement;
    elName = deName.nativeElement;
    elCategory = deCategory.nativeElement;
    elPrice = dePrice.nativeElement;
    elFutureCategory = deFutureCategory.nativeElement;
    elChangeDate = deChangeDate.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table and have five fields: Domain, Category, Amount, Future Category and Change Date.', () => {
    expect(elTable).toBeTruthy();
    expect(elName).toBeTruthy();
    expect(elCategory).toBeTruthy();
    expect(elPrice).toBeTruthy();
    expect(elFutureCategory).toBeTruthy();
    expect(elChangeDate).toBeTruthy();
  });
});
