import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';
import { TldService } from '../../service/tld.service';
import { Tld } from '../../model/tld.model';
import { TldsIndexComponent } from './tlds-index.component';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { HttpModule } from '@angular/http';
import { HttpClient } from '../../shared/http.client';
import { MeService } from '../../service/me.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { Pipe, PipeTransform } from '@angular/core';

describe('TldsIndexComponent', () => {
  let component: TldsIndexComponent;
  let fixture: ComponentFixture<TldsIndexComponent>;

  let deTable, deHeader, deNameTitle, deCSVButton: DebugElement;
  let elTable, elHeader, elNameTitle, elCSVButton: HTMLElement;

  const mockMeService = {
   get: jasmine.createSpy('get')
  };

 const mockOauthService = {
   getAccessToken: jasmine.createSpy('getAccessToken')
 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TldsIndexComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ FormsModule, DialogModule, DataTableModule, HttpModule ],
      providers: [ HttpClient, TldService,
       { provide: MeService, useValue: mockMeService },
       { provide: OAuthService, useValue: mockOauthService} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TldsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deHeader = fixture.debugElement.query(By.css('.page-header'));
    deTable = fixture.debugElement.query(By.css('#tldsTable'));
    deNameTitle = fixture.debugElement.query(By.css('.ui-column-title'));
    deCSVButton = fixture.debugElement.query(By.css('.left'));

    elCSVButton = deCSVButton.nativeElement;
    elHeader = deHeader.nativeElement;
    elTable = deTable.nativeElement;
    elNameTitle = deNameTitle.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should display TLDs table.', () => {
    expect(elHeader).toBeTruthy();
    expect(elHeader.innerText).toEqual('Manage TLDs');
    expect(elTable).toBeTruthy();
    expect(elNameTitle.innerText).toEqual('TLD');
    expect(elCSVButton.getAttribute('label')).toEqual('CSV');
  });
});
