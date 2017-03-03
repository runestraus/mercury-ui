import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Contact } from '../../model/contact.model';
import { SearchComponent } from '../search.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let deTable, deContactName, deContactId, deCurrentSponsorClientId, deExportButton: DebugElement;
  let elTable, elContactName, elContactId, elCurrentSponsorClientId: HTMLElement;

  const contact: Contact[] = [{
    contactId: '1234',
    currentSponsorClientId: 'tldsrus',
    name: 'Donnie',
    address: this.address,
    org: 'TC',
    type: '',
    deletionTime: null
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactComponent, SearchComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deTable = fixture.debugElement.query(By.css('#contactsTable'));
    deExportButton = fixture.debugElement.query(By.css('#exportButton'));
    deContactName = fixture.debugElement.query(By.css('#contactName'));
    deContactId = fixture.debugElement.query(By.css('#contactId'));
    deCurrentSponsorClientId = fixture.debugElement.query(By.css('#currentSponsorClientId'));

    elTable = deTable.nativeElement;
    elContactName = deContactName.nativeElement;
    elContactId = deContactId.nativeElement;
    elCurrentSponsorClientId = deCurrentSponsorClientId.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all elements on the page, contactsTable, Export Button, Error Table, ' +
    'Contact Name field, Contact ID field, Client Id.', () => {
    expect(elTable).toBeTruthy();
    expect(deExportButton).toBeTruthy();
    expect(deContactName).toBeTruthy();
    expect(deContactId).toBeTruthy();
    expect(deCurrentSponsorClientId).toBeTruthy();
  });
});
