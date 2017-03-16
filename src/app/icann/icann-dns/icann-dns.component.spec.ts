import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IcannDnsComponent } from './icann-dns.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IcannService } from '../../service/icann.service';
import { HttpClient } from '../../shared/http.client';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'primeng/primeng';

describe('IcannDnsComponent', () => {
  let component: IcannDnsComponent;
  let fixture: ComponentFixture<IcannDnsComponent>;
  let deTldInput, deDate, deDnsReceivedCount, deDnsRespondedCount, deTcpReceivedCount, deTcpRespondedCount: DebugElement;
  let elTldInput, elDate, elDnsReceivedCount, elDnsRespondedCount, elTcpReceivedCount, elTcpRespondedCount: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcannDnsComponent ],
      imports:      [ FormsModule, HttpModule, CalendarModule ],
      providers: [
        IcannService, HttpClient
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcannDnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deTldInput = fixture.debugElement.query(By.css('#tld'));
    deDate = fixture.debugElement.query(By.css('#date'));
    deDnsReceivedCount = fixture.debugElement.query(By.css('#dnsReceivedCount'));
    deDnsRespondedCount = fixture.debugElement.query(By.css('#dnsRespondedCount'));
    deTcpReceivedCount = fixture.debugElement.query(By.css('#tcpReceivedCount'));
    deTcpRespondedCount = fixture.debugElement.query(By.css('#tcpRespondedCount'));

    elTldInput = deTldInput.nativeElement;
    elDate = deDate.nativeElement;
    elDnsReceivedCount = deDnsReceivedCount.nativeElement;
    elDnsRespondedCount = deDnsRespondedCount.nativeElement;
    elTcpReceivedCount = deTcpReceivedCount.nativeElement;
    elTcpRespondedCount = deTcpRespondedCount.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display six input fields: tld, date, dnsUdpQueriesReceivedCount, dnsUdpQueriesRespondedCount, ' +
    'dnsTcpQueriesReceivedCount, dnsTcpQueriesRespondedCount', () => {
    expect(elTldInput).toBeTruthy();
    expect(elDate).toBeTruthy();
    expect(elDnsReceivedCount).toBeTruthy();
    expect(elDnsRespondedCount).toBeTruthy();
    expect(elTcpReceivedCount).toBeTruthy();
    expect(elTcpRespondedCount).toBeTruthy();
  });
});
