import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PremiumNameComponent } from './premium-name.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ToolsService } from '../../service/tools.service';
import { HttpClient } from '../../shared/http.client';
import { HttpModule } from '@angular/http';
import { DocQuery } from '../../shared/testutils';
import { CSV } from '../../model/csv.model';
import { FileUploadModule } from 'primeng/primeng';

class Page {
  query: DocQuery<PremiumNameComponent>;

  constructor(private fixture: ComponentFixture<PremiumNameComponent>) {
    this.query = new DocQuery(fixture);
  }

  getUploadButton (): DebugElement {
    const btn = this.query.getElementByCss('button[icon=fa-upload]');
    return btn;
  }

  getElementByCss(selector: string): DebugElement {
    const el = this.query.getElementByCss(selector);
    expect(el).toBeTruthy('Element not found: ' + selector);
    return el;
  }

  getCSVButton(label: string): string {
    const el = this.query.getElementByCss('#downloadPremiumNameCsv');
    return el ? el.nativeElement.getAttribute('label') : null;
  }
}

describe('PremiumNameComponent', () => {
  const toolsService = {
    JSONToCSVConvertor: jasmine.createSpy('JSONToCSVConvertor'),
    downloadTemplate: jasmine.createSpy('downloadTemplate'),
    validateCSV: jasmine.createSpy('validateCSV'),
    uploadCSV: jasmine.createSpy('uploadCSV')
  };

  let component: PremiumNameComponent;
  let fixture: ComponentFixture<PremiumNameComponent>;
  let deTable, deName, deCategory, dePrice, deFutureCategory, deChangeDate: DebugElement;
  let elTable, elName, elCategory, elPrice, elFutureCategory, elChangeDate: HTMLElement;
  let page: Page;

  const csv = [
    {
      'name': 'domains.cow',
      'category': 'AA',
      'price': {
        'value': 22.99,
        'currency': 'USD'
      },
      'futureCategory': 'AA+',
      'changeDate': '2017-04-01'
    },
    {
      'name': 'operation.cow',
      'category': 'BB',
      'price': {
        'value': 2.23,
        'currency': 'USD'
      },
      'futureCategory': 'CCCC',
      'changeDate': '2017-04-06'
    },
    {
      'name': 'test.cow',
      'category': 'AA',
      'price': {
        'value': 22.99,
        'currency': 'USD'
      },
      'futureCategory': '',
      'changeDate': ''
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PremiumNameComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpModule, FileUploadModule],
      providers: [HttpClient, { provide: ToolsService, useValue: toolsService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumNameComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
    deTable = fixture.debugElement.query(By.css('#premiumPriceTable'));
    deName = fixture.debugElement.query(By.css('#premiumDomainName'));
    deCategory = fixture.debugElement.query(By.css('#premiumDomainCategory'));
    dePrice = fixture.debugElement.query(By.css('#premiumDomainPrice'));
    deFutureCategory = fixture.debugElement.query(By.css('#premiumDomainFutureCategory'));
    deChangeDate = fixture.debugElement.query(By.css('#premiumDomainChangeDate'));

    elTable = deTable.nativeElement;
    elName = deName.nativeElement;
    elCategory = deCategory.nativeElement;
    elPrice = dePrice.nativeElement;
    elFutureCategory = deFutureCategory.nativeElement;
    elChangeDate = deChangeDate.nativeElement;

    const ev = {} as Event;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display table and have five fields: Domain, Category, Amount, Future Category and Change Date.', () => {
    expect(elTable).toBeTruthy();
    expect(elName).toBeTruthy();
    expect(elCategory).toBeTruthy();
    expect(elPrice).toBeTruthy();
    expect(elFutureCategory).toBeTruthy();
    expect(elChangeDate).toBeTruthy();
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
    fixture = TestBed.createComponent(PremiumNameComponent);
    component = fixture.componentInstance;
    component.exportCSV();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(toolsService.JSONToCSVConvertor).toHaveBeenCalledWith([], 'PremiumNames');
      expect(toolsService.JSONToCSVConvertor.and.returnValue(Promise.resolve(this.csv)));
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));

  it('should download a template', async(() => {
    const csvTemplate = 'Operation,Domain,Tags\nC,example.donuts,';
    fixture = TestBed.createComponent(PremiumNameComponent);
    component = fixture.componentInstance;
    component.downloadTemplate(csvTemplate);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(toolsService.downloadTemplate).toHaveBeenCalledWith(csvTemplate);
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));

  it('should validate file', async(() => {
    fixture = TestBed.createComponent(PremiumNameComponent);
    component = fixture.componentInstance;
    const displayResult = {} as CSV;
    toolsService.validateCSV.and.returnValue(Promise.resolve(displayResult));
    component.validateFile(this.ev);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(toolsService.validateCSV).toHaveBeenCalledWith('/api/premiumnames/csv', this.ev);
      expect(component.error).toBeNull();
      expect(component.hideChanges).toBe(false);
      expect(component.hideResult).toBe(true);
      expect(component.dialogResult).toBe(displayResult);
      expect(component.token).toBe(displayResult.token);
      const uploadBtn = page.getUploadButton();
      expect((uploadBtn.nativeElement.getAttribute('disabled'))).toBe('');
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));

  it('should fail file validation', async(() => {
    fixture = TestBed.createComponent(PremiumNameComponent);
    component = fixture.componentInstance;
    const displayResult = {} as CSV;
    toolsService.validateCSV.and.returnValue(Promise.reject(displayResult));
    component.validateFile(this.ev);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(toolsService.validateCSV).toHaveBeenCalledWith('/api/premiumnames/csv', this.ev);
      expect(component.hideChanges).toBe(true);
      expect(component.hideResult).toBe(true);
      expect(component.displayDialog).toBe(true);
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));

  it('should upload file', async(() => {
    fixture = TestBed.createComponent(PremiumNameComponent);
    component = fixture.componentInstance;
    const mockUploadResult = {
      total: 1,
      create: 0,
      update: 1,
      delete: 0,
      result: {
      create: [],
      update: [{name: 'italys.pizza', category: 'BBB+',
        price: {value: 66, currency: 'USD'},
        futureCategory: 'AA+', changeDate: '2018-12-31'}],
      delete: []}
    };
    toolsService.uploadCSV.and.returnValue(Promise.resolve(mockUploadResult));
    component.uploadCSV(this.ev);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(toolsService.uploadCSV).toHaveBeenCalledWith('/api/premiumnames/csv/' + component.token);
      expect(component.updates).toBe(mockUploadResult.result.update);
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));

  it('should fail to upload file', async(() => {
    fixture = TestBed.createComponent(PremiumNameComponent);
    component = fixture.componentInstance;
    const mockUploadResult = {
      total: 1,
      create: 0,
      update: 1,
      delete: 0,
      result: {
      create: [],
      update: [{name: 'italys.pizza', category: 'BBB+',
        price: {value: 66, currency: 'USD'},
        futureCategory: null, changeDate: '2018-12-31'}],
      delete: []}
    };
    toolsService.uploadCSV.and.returnValue(Promise.reject(mockUploadResult));
    component.uploadCSV(this.ev);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(toolsService.uploadCSV).toHaveBeenCalledWith('/api/premiumnames/csv/' + component.token);
    }).catch(err => {
      fail('Err: ' + err);
    });
  }));
});
