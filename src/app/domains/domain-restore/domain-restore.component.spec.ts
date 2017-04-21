import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DocQuery } from '../../shared/testutils';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomainEppService } from '../../service/domain-epp.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DomainRestoreComponent } from './domain-restore.component';

class Page {
  fix: ComponentFixture<DomainRestoreComponent>;
  elRestoreButton: HTMLElement;
  elCancelButton: HTMLElement;

  query: DocQuery<DomainRestoreComponent>;
  constructor(private fixture: ComponentFixture<DomainRestoreComponent>) {
    this.query = new DocQuery(fixture);
    this.fix = fixture;
  }
  clickRestore() {
    this.elRestoreButton = this.fix.debugElement.query(By.css('#domainRestoreSubmit')).nativeElement;
    expect(this.elRestoreButton).toBeTruthy();
    this.elRestoreButton.click();
  }
  clickCancel() {
    this.elCancelButton = this.fix.debugElement.query(By.css('#domainRestoreClose')).nativeElement;
    expect(this.elCancelButton).toBeTruthy();
    this.elCancelButton.click();
  }

  clickClose() {
    this.elCancelButton = this.fix.debugElement.query(By.css('#buttonCloseX')).nativeElement;
    expect(this.elCancelButton).toBeTruthy();
    this.elCancelButton.click();
  }

  getErrorMessage(): string {
    const el = this.query.getElementByCss('.alert-danger');
    return el == null ? null : el.nativeElement.textContent.trim();
  }
}

describe('DomainRestoreComponent', () => {
  let component: DomainRestoreComponent;
  let fixture: ComponentFixture<DomainRestoreComponent>;
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
    restore: jasmine.createSpy('restore'),
  };
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  function resolveDomainError(errorMessage) {
    mockDomainEppService.restore.and.returnValue(Promise.reject({ message: errorMessage }));
    fixture.detectChanges();
    return fixture.whenStable();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DomainRestoreComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DomainEppService, useValue: mockDomainEppService },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [RouterModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainRestoreComponent);
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

  it('should call restore for domain', () => {
    mockDomainEppService.restore.and.returnValues(
      Promise.resolve({
        code: '200',
        'msg': {
          'keyValue': 'Success'
        },
      })
    );
    page.clickRestore();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(mockDomainEppService.restore).toHaveBeenCalledWith('dev.dev');
      expect(mockDomainEppService.restore).toHaveBeenCalledTimes(1);
    });
  });

  it('should call cancel for domain', () => {
    page.clickCancel();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['..'], { relativeTo: mockRoute });
    });
  });

  it('should call close for domain', () => {
    page.clickClose();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['..'], { relativeTo: mockRoute });
    });
  });

  it('should show submit error to user', async(() => {
    resolveDomainError('It done broke').then(() => {
      fixture.detectChanges();
      page.clickRestore();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(page.getErrorMessage()).toBe('It done broke');
      });
    });
  }));
});
