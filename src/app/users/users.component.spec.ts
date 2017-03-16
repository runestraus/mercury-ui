import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';
import { UsersService } from '../service/users.service';
import { RolesService } from '../service/roles.service';
import { UsersComponent } from './users.component';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { HttpModule } from '@angular/http';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  let deTable, deHeader, deEmailTitle, deCSVButton: DebugElement;
  let elTable, elHeader, elEmailTitle, elCSVButton: HTMLElement;

  const mockRolesService = {
   get: jasmine.createSpy('get')
  };

 const mockUsersService = {
   get: jasmine.createSpy('get')
 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersComponent ],
      imports: [ FormsModule, DialogModule, DataTableModule, HttpModule ],
      providers: [
       { provide: RolesService, useValue: mockRolesService },
       { provide: UsersService, useValue: mockUsersService} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockUsersService.get.and.returnValue(Promise.resolve());
    mockRolesService.get.and.returnValue(Promise.resolve());
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deHeader = fixture.debugElement.query(By.css('.page-header'));
    deTable = fixture.debugElement.query(By.css('#usersTable'));
    deEmailTitle = fixture.debugElement.query(By.css('.ui-column-title'));
    deCSVButton = fixture.debugElement.query(By.css('.left'));

    elCSVButton = deCSVButton.nativeElement;
    elHeader = deHeader.nativeElement;
    elTable = deTable.nativeElement;
    elEmailTitle = deEmailTitle.nativeElement;
  });

  it('should display users table.', () => {
    expect(elHeader).toBeTruthy();
    expect(elHeader.innerText).toEqual('Manage Users');
    expect(elTable).toBeTruthy();
    expect(elEmailTitle.innerText).toEqual('Google Account');
    expect(elCSVButton.getAttribute('label')).toEqual('CSV');
  });
});
