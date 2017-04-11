import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservedNameComponent } from './reserved-name.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ToolsService } from '../../service/tools.service';
import { HttpClient } from '../../shared/http.client';
import { HttpModule } from '@angular/http';
import { DocQuery } from '../../shared/testutils';
import { CSV } from '../../model/csv.model';
import { FileUploadModule } from 'primeng/primeng';

class Page {
  query: DocQuery<ReservedNameComponent>;

  constructor(private fixture: ComponentFixture<ReservedNameComponent>) {
    this.query = new DocQuery(fixture);
  }

  getElementByCss(selector: string): DebugElement {
    const el = this.query.getElementByCss(selector);
    expect(el).toBeTruthy('Element not found: ' + selector);
    return el;
  }

  getUploadButton (): DebugElement {
    const btn = this.query.getElementByCss('button[icon=fa-upload]');
    return btn;
  }

  getCSVButton(label: string): string {
    const el = this.query.getElementByCss('#downloadPremiumNameCsv');
    return el ? el.nativeElement.getAttribute('label') : null;
  }
}

describe('ReservedNameComponent', () => {
  const toolsService = {
    JSONToCSVConvertor: jasmine.createSpy('JSONToCSVConvertor'),
    downloadTemplate: jasmine.createSpy('downloadTemplate'),
    validateCSV: jasmine.createSpy('validateCSV'),
    uploadCSV: jasmine.createSpy('uploadCSV')
  };

  let component: ReservedNameComponent;
  let fixture: ComponentFixture<ReservedNameComponent>;
  let deTable, deName, deTags: DebugElement;
  let elTable, elName, elTags: HTMLElement;
  let page: Page;

  function getElementByCss(selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
  }

  const csv = [
    {
      'name': 'cow.cow',
      'reservationType': 'FULLY_BLOCKED',
      'tags': 'Unrestricted',
      'registered': false
    }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReservedNameComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpModule, FileUploadModule],
      providers: [HttpClient, { provide: ToolsService, useValue: toolsService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservedNameComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    deTable = fixture.debugElement.query(By.css('#reservedNamesTable'));
    deName = fixture.debugElement.query(By.css('#reservedDomainName'));
    deTags = fixture.debugElement.query(By.css('#reservedDomainTags'));

    elTable = deTable.nativeElement;
    elName = deName.nativeElement;
    elTags = deTags.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table and have two fields: Domain and Tags.', () => {
    expect(elTable).toBeTruthy();
    expect(elName).toBeTruthy();
    expect(elTags).toBeTruthy();
  });

  it('should have tools modal opened', () => {
    component.ngOnInit();
    expect(component.displayDialog).toBe(true);
    expect(component.hideResult).toBe(true);
    expect(component.hideChanges).toBe(true);
    expect(component.hideErrors).toBe(true);
    expect(page.getCSVButton('CSV'));
  });

  it('should convert to CSV and download', async(() => {
    fixture = TestBed.createComponent(ReservedNameComponent);
    component = fixture.componentInstance;
    component.exportCSV();
    fixture.whenStable().then(() => {
      expect(toolsService.JSONToCSVConvertor).toHaveBeenCalled();
      expect(toolsService.JSONToCSVConvertor.and.returnValue(Promise.resolve(csv)));
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));

  it('should download a template', async(() => {
    const csvTemplate = 'Operation,Domain,Tags\nC,example.donuts,';
    fixture = TestBed.createComponent(ReservedNameComponent);
    component = fixture.componentInstance;
    component.downloadTemplate(csvTemplate);
    fixture.whenStable().then(() => {
      expect(toolsService.downloadTemplate).toHaveBeenCalledWith(csvTemplate);
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));

  it('should validate file', async(() => {
    fixture = TestBed.createComponent(ReservedNameComponent);
    component = fixture.componentInstance;
    const displayResult = {} as CSV;
    toolsService.validateCSV.and.returnValue(Promise.resolve(displayResult));
    component.validateFile(this.ev);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(toolsService.validateCSV).toHaveBeenCalledWith('/api/reservednames/csv', this.ev);
      expect(component.error).toBeNull();
      expect(component.hideChanges).toBe(false);
      expect(component.hideResult).toBe(true);
      expect(component.dialogResult).toBe(displayResult);
      expect(component.token).toBe(displayResult.token);
      const uploadBtn = page.getUploadButton();
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));

  it('should fail file validation', async(() => {
    fixture = TestBed.createComponent(ReservedNameComponent);
    component = fixture.componentInstance;
    const displayResult = {} as CSV;
    toolsService.validateCSV.and.returnValue(Promise.reject(displayResult));
    component.validateFile(this.ev);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(toolsService.validateCSV).toHaveBeenCalledWith('/api/reservednames/csv', this.ev);
      expect(component.hideChanges).toBe(true);
      expect(component.hideResult).toBe(true);
      expect(component.displayDialog).toBe(true);
    }).catch(err => {
      fail('Err: ' + err);
      expect(toolsService.validateCSV).toThrowError(err);
      if (Array.isArray(err)) {
        expect(component.error).toBe(err);
        expect(component.hideErrors).toBe(false);
        expect(component.errorData).toBe(err);
      } else {
        expect(component.error).toBe(err);
      }
    });
  }));

  it('should fail to upload file', async(() => {
    fixture = TestBed.createComponent(ReservedNameComponent);
    component = fixture.componentInstance;
    const mockUploadResult = {
      total: 1,
      create: 0,
      update: 1,
      delete: 0,
      result: {
      create: [],
      update: [{tags: 'Unrestricted,Tag1'}],
      delete: []}
    };
    toolsService.uploadCSV.and.returnValue(Promise.resolve(mockUploadResult));
    component.uploadCSV(this.ev);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(toolsService.uploadCSV).toHaveBeenCalledWith('/api/reservednames/csv/' + component.token);
      expect(component.updates).toBe(mockUploadResult.result.update);
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
});
