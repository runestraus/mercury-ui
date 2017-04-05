import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IcannTldComponent } from './icann-tld.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'primeng/components/calendar/calendar';
import { IcannService } from '../../service/icann.service';
import { HttpClient } from '../../shared/http.client';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('IcannTldComponent', () => {
  let component: IcannTldComponent;
  let fixture: ComponentFixture<IcannTldComponent>;
  let deTldInput, deDate, deWonCount, deLostCount, deNonDecisionCount , deReqCount, deGreantedCount, deDomainsCount: DebugElement;
  let elTldInput, elDate, elWonCount, elLostCount, elNonDecisionCount , elReqCount, elGreantedCount, elDomainsCount: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcannTldComponent ],
      imports:      [ FormsModule, HttpModule, CalendarModule, NoopAnimationsModule ],
      providers: [
        IcannService, HttpClient,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcannTldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deTldInput = fixture.debugElement.query(By.css('#tld'));
    deDate = fixture.debugElement.query(By.css('#date'));
    deWonCount = fixture.debugElement.query(By.css('#wonCount'));
    deLostCount = fixture.debugElement.query(By.css('#lostCount'));
    deNonDecisionCount = fixture.debugElement.query(By.css('#nonDecisionCount'));
    deReqCount = fixture.debugElement.query(By.css('#reqCount'));
    deGreantedCount = fixture.debugElement.query(By.css('#greantedCount'));
    deDomainsCount = fixture.debugElement.query(By.css('#domainsCount'));

    elTldInput = deTldInput.nativeElement;
    elDate = deTldInput.nativeElement;
    elWonCount = deTldInput.nativeElement;
    elLostCount = deTldInput.nativeElement;
    elNonDecisionCount = deTldInput.nativeElement;
    elReqCount = deTldInput.nativeElement;
    elGreantedCount = deTldInput.nativeElement;
    elDomainsCount = deTldInput.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display four fields: tld, date, wonCount, lostCount, nonDecisionCount, reqCount, greantedCount, domainsCount', () => {
    expect(elTldInput).toBeTruthy();
    expect(elDate).toBeTruthy();
    expect(elWonCount).toBeTruthy();
    expect(elLostCount).toBeTruthy();
    expect(elNonDecisionCount).toBeTruthy();
    expect(elReqCount).toBeTruthy();
    expect(elGreantedCount).toBeTruthy();
    expect(elDomainsCount).toBeTruthy();
  });
});
