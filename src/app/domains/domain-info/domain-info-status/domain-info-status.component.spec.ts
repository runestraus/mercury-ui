import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core/index';
import { TooltipModule } from 'primeng/primeng';

import { DomainInfoStatusComponent } from './domain-info-status.component';
import { DomainDetail } from '../../../model/domain.model';

describe('DomainInfoStatusComponent', () => {
  let component: DomainInfoStatusComponent;
  let fixture: ComponentFixture<DomainInfoStatusComponent>;

  function getDomainData(statuses: Array<string>): DomainDetail {
    return {
      fullyQualifiedDomainName: 'holy.cow',
      status: statuses,
      currentSponsorClientId: 'brodaddy',
    } as DomainDetail;
  }

  function getElementByCss(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainInfoStatusComponent ],
      imports: [ TooltipModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainInfoStatusComponent);
    component = fixture.componentInstance;
  });

  it('should show a smiley icon for active domain', () => {
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
    expect(getElementByCss('#domainStatusIconOK')).toBeTruthy('Expected active smiley icon');
    expect(getElementByCss('#domainStatusIconInactive')).toBeFalsy('Expected no inactive meh icon');
  });

  it('should show a meh icon for inactive domain', () => {
    component.domain = getDomainData(['inactive']);
    fixture.detectChanges();
    expect(getElementByCss('#domainStatusIconInactive')).toBeTruthy('Expected active smiley icon');
    expect(getElementByCss('#domainStatusIconOK')).toBeFalsy('Expected no active smiley icon');
  });

  it('should show a normal domain transfer icon when transfer is not prohibited', () => {
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
    expect(getElementByCss('#domainStatusIconTransfer').classes['fa-2x']).toBeTruthy();
    expect(getElementByCss('#domainStatusIconTransferProhibited')).toBeFalsy();
  });

  it('should show a prohibited transfer icon when transfer is prohibited', () => {
    component.domain = getDomainData(['ok', 'clientTransferProhibited']);
    fixture.detectChanges();
    expect(getElementByCss('#domainStatusIconTransfer').classes['fa-stack-1x']).toBeTruthy();
    expect(getElementByCss('#domainStatusIconTransferProhibited')).toBeTruthy();
  });

  // TODO: test transfer click navigates to modal

  it('should show a normal domain renew icon when renew is not prohibited', () => {
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
    expect(getElementByCss('#domainStatusIconRenew').classes['fa-2x']).toBeTruthy();
    expect(getElementByCss('#domainStatusIconRenewProhibited')).toBeFalsy();
  });

  it('should show a prohibited renew icon when renew is prohibited', () => {
    component.domain = getDomainData(['ok', 'clientRenewProhibited']);
    fixture.detectChanges();
    expect(getElementByCss('#domainStatusIconRenew').classes['fa-stack-1x']).toBeTruthy();
    expect(getElementByCss('#domainStatusIconRenewProhibited')).toBeTruthy();
  });

  // TODO: test renew click navigates to modal

  // TODO: test restore click navigates to modal

  it('should show a normal domain delete icon when delete is not prohibited', () => {
    component.domain = getDomainData(['ok']);
    fixture.detectChanges();
    expect(getElementByCss('#domainStatusIconDelete').classes['fa-2x']).toBeTruthy();
    expect(getElementByCss('#domainStatusIconDeleteProhibited')).toBeFalsy();
  });

  it('should show a prohibited delete icon when delete is prohibited', () => {
    component.domain = getDomainData(['ok', 'clientDeleteProhibited']);
    fixture.detectChanges();
    expect(getElementByCss('#domainStatusIconDelete').classes['fa-stack-1x']).toBeTruthy();
    expect(getElementByCss('#domainStatusIconDeleteProhibited')).toBeTruthy();
  });

  // TODO: test domain server status click navigates to modal

  // TODO: test domain client status click navigates to modal

});
