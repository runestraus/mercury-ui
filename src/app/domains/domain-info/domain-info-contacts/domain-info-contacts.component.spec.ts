import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core/index';

import { ContactEppService } from '../../../contacts/contactepp.service';
import { DomainInfoContactsComponent } from './domain-info-contacts.component';
import { DomainDetail } from '../../../model/domain.model';
import { DocQuery } from '../../../shared/testutils';

class Page {
  query: DocQuery<DomainInfoContactsComponent>;

  constructor(private fixture: ComponentFixture<DomainInfoContactsComponent>) {
    this.query = new DocQuery(fixture);
  }

  getContactName(contactId: string): string {
    const el = this.query.getElementByCss('#contact-name-' + contactId);
    return el ? el.nativeElement.textContent : null;
  }

  getContactTypes(contactId: string): string {
    const el = this.query.getElementByCss('#contact-type-' + contactId);
    return el ? el.nativeElement.textContent : null;
  }
}

describe('DomainInfoContactsComponent', () => {

  let component: DomainInfoContactsComponent;
  let fixture: ComponentFixture<DomainInfoContactsComponent>;
  let page: Page;

  const contactEppService = {
    infoContact: jasmine.createSpy('infoContact'),
    checkContact: jasmine.createSpy('checkContact'),
    deleteContact: jasmine.createSpy('deleteContact'),
    updateContact: jasmine.createSpy('updateContact'),
    updateContactStatus: jasmine.createSpy('updateContactStatus'),
    createContact: jasmine.createSpy('createContact'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainInfoContactsComponent ],
      providers: [
        { provide: ContactEppService, useValue: contactEppService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainInfoContactsComponent);
    page = new Page(fixture);
    component = fixture.componentInstance;
    component.domain = {
      fullyQualifiedDomainName: 'foo.com',
      status: ['ok'],
      repoId: 'FOO-123',
      currentSponsorClientId: 'RegistrarX',
      creationClientId: 'RegistrarX',
      creationTime: '2001-01-01T00:00:00Z',
      registrationExpirationTime: '2002-01-01T00:00:00Z',
      authInfo: '',
      nameservers: [],
      subordinateHosts: [],
      rgpStatus: '',
      domainPrices: null,
      contacts: {
        'tech': 'foo',
        'admin': 'foo',
        'registrant': 'bar',
      },
    } as DomainDetail;
  });

  it('should load a list of contacts', async(() => {
    contactEppService.infoContact.and.returnValues(
      Promise.resolve({
        contactId: 'foo',
        postalInfo: [
          {
            name: 'Foo',
            address: {
              city: 'fooville',
              countryCode: 'US',
            },
          }
        ],
      }),
      Promise.resolve({
        contactId: 'bar',
        postalInfo: [
          {
            name: 'Bar',
            address: {
              city: 'bartopia',
              countryCode: 'US',
            },
          }
        ],
      })
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(contactEppService.infoContact).toHaveBeenCalledWith('foo');
      expect(contactEppService.infoContact).toHaveBeenCalledWith('bar');
      expect(contactEppService.infoContact).toHaveBeenCalledTimes(2);
    });
  }));

  it('should show a list of contacts', async(() => {
    contactEppService.infoContact.and.returnValues(
      Promise.resolve({
        contactId: 'foo',
        postalInfo: [
          {
            name: 'Foo',
            address: {
              city: 'fooville',
              countryCode: 'US',
            },
          }
        ],
      }),
      Promise.resolve({
        contactId: 'bar',
        postalInfo: [
          {
            name: 'Bar',
            address: {
              city: 'bartopia',
              countryCode: 'US',
            },
          }
        ],
      })
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getContactName('foo')).toBe('Foo - fooville, US');
      expect(page.getContactTypes('foo')).toBe('admin, tech');
      expect(page.getContactName('bar')).toBe('Bar - bartopia, US');
      expect(page.getContactTypes('bar')).toBe('registrant');
    });
  }));

  // TODO: test clicking update domain contacts dialog

  // TODO: test clicking update contact dialog

});
