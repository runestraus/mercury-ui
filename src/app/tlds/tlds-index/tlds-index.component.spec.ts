import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import 'rxjs/add/operator/toPromise';
import { TldService } from '../../service/tld.service';
import { TldsIndexComponent } from './tlds-index.component';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { HttpModule } from '@angular/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TldsIndexComponent', () => {
  let component: TldsIndexComponent;
  let fixture: ComponentFixture<TldsIndexComponent>;

  let deTable, deHeader, deNameTitle: DebugElement;
  let elTable, elHeader, elNameTitle: HTMLElement;

  const mockTldService = {
    get: jasmine.createSpy('get')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TldsIndexComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, DialogModule, DataTableModule, HttpModule, NoopAnimationsModule],
      providers: [
        { provide: TldService, useValue: mockTldService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    mockTldService.get.and.returnValue(Promise.resolve());
    fixture = TestBed.createComponent(TldsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deHeader = fixture.debugElement.query(By.css('.page-header'));
    deTable = fixture.debugElement.query(By.css('#tldsTable'));
    deNameTitle = fixture.debugElement.query(By.css('.ui-column-title'));

    elHeader = deHeader.nativeElement;
    elTable = deTable.nativeElement;
    elNameTitle = deNameTitle.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display TLDs table.', () => {
    expect(elHeader).toBeTruthy();
    expect(elHeader.innerText).toEqual('Manage TLDs');
    expect(elTable).toBeTruthy();
    expect(elNameTitle.innerText).toEqual('TLD');
  });
});
