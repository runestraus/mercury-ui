import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomainDeleteComponent } from './domain-delete.component';
import { DocQuery } from '../../shared/testutils';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomainEppService } from '../../service/domain-epp.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

class Page {
  fix: ComponentFixture<DomainDeleteComponent>;
  elDeleteButton: HTMLElement;
  elCancelButton: HTMLElement;

  query: DocQuery<DomainDeleteComponent>;
  constructor(private fixture: ComponentFixture<DomainDeleteComponent>) {
    this.query = new DocQuery(fixture);
    this.fix = fixture;
  }
  clickDelete() {
    this.elDeleteButton = this.fix.debugElement.query(By.css('#domainDeleteSubmit')).nativeElement;
    expect(this.elDeleteButton).toBeTruthy();
    this.elDeleteButton.click();
  }
  clickCancel() {
    this.elCancelButton = this.fix.debugElement.query(By.css('#domainDeleteClose')).nativeElement;
    expect(this.elCancelButton).toBeTruthy();
    this.elCancelButton.click();
  }
}

describe('DomainDeleteComponent', () => {
  let component: DomainDeleteComponent;
  let fixture: ComponentFixture<DomainDeleteComponent>;
  let page: Page;
  let router;
  let route;
  const mockRoute = {
    snapshot: {
      params: {
        'domainName': 'dev.dev',
      }
    },
    parent: {
      url: Observable.create((observer: Observer<Array<string>>) => {
        observer.next(['domainName', 'dev.dev']);
        observer.complete();
      })
    }
  };
  const mockDomainEppService = {
    deleteDomain: jasmine.createSpy('deleteDomain'),
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainDeleteComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DomainEppService, useValue: mockDomainEppService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [ RouterModule, ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainDeleteComponent);
    router = TestBed.get(ActivatedRoute);
    route = TestBed.get(Router);
    route.url = '/search/dev.dev/domains/dev.dev';
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call delete for domain', () => {
    mockDomainEppService.deleteDomain.and.returnValues(
      Promise.resolve({
        code: '200',
        'msg': {
          'keyValue': 'Success'
        },
      })
    );
    page.clickDelete();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(mockDomainEppService.deleteDomain).toHaveBeenCalledWith('dev.dev');
      expect(mockDomainEppService.deleteDomain).toHaveBeenCalledTimes(1);
    });
  });

  it('should call cancel for domain', () => {
    page.clickCancel();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/search/dev.dev/domains/dev.dev']);
      });
    });
  });
});
