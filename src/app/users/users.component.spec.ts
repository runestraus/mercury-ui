import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';
import { UsersService } from '../service/users.service';
import { RolesService } from '../service/roles.service';
import { User } from '../model/users.model';
import { Role } from '../model/roles.model';
import { UsersComponent } from './users.component';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { HttpModule } from '@angular/http';
import { HttpClient } from '../shared/http.client';
import { MeService } from '../service/me.service';
import { OAuthService } from 'angular-oauth2-oidc';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  let deTable, deHeader, deEmailTitle, deCSVButton: DebugElement;
  let elTable, elHeader, elEmailTitle, elCSVButton: HTMLElement;

  const mockMeService = {
   get: jasmine.createSpy('get')
  };

 const mockOauthService = {
   getAccessToken: jasmine.createSpy('getAccessToken')
 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ FormsModule, DialogModule, DataTableModule, HttpModule ],
      providers: [ HttpClient, UsersService, RolesService,
       { provide: MeService, useValue: mockMeService },
       { provide: OAuthService, useValue: mockOauthService} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deHeader = fixture.debugElement.query(By.css('.page-header'));
    deTable = fixture.debugElement.query(By.css('#usersTable'));
    deEmailTitle = fixture.debugElement.query(By.css('.ui-column-title'));
    deCSVButton = fixture.debugElement.query(By.css('button'));

    elCSVButton = deCSVButton.nativeElement;
    elHeader = deHeader.nativeElement;
    elTable = deTable.nativeElement;
    elEmailTitle = deEmailTitle.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display users table.', () => {
    expect(elHeader).toBeTruthy();
    expect(elHeader.innerText).toEqual('Manage Users');
    expect(elTable).toBeTruthy();
    expect(elEmailTitle.innerText).toEqual('Google Account');
    expect(elCSVButton.innerText).toEqual('CSV');
  });
});