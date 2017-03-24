import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { DomainEppService } from '../../service/domain-epp.service';
import { DomainInfoComponent } from './domain-info.component';
import { DocQuery } from '../../shared/testutils';

class Page {
  query: DocQuery<DomainInfoComponent>;

  constructor(private fixture: ComponentFixture<DomainInfoComponent>) {
    this.query = new DocQuery(fixture);
  }

  getErrorMessage(): string {
    const el = this.query.getElementByCss('#domainInfoError');
    return el ? el.nativeElement.textContent : null;
  }

  isLoading(): boolean {
    return this.query.getElementByCss('#domainInfoLoading') != null;
  }

  hasInfoIcon(): boolean {
    return this.query.getElementByCss('#domainInfoIcon') != null;
  }

  getDomainExpiration(): string {
    const el = this.query.getElementByCss('.domainExpirationHeader');
    return el ? el.nativeElement.textContent : null;
  }
}

describe('DomainInfoComponent', () => {
  let component: DomainInfoComponent;
  let fixture: ComponentFixture<DomainInfoComponent>;
  let page: Page;

  const mockDomainEppService = {
    info: jasmine.createSpy('info'),
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockRoute = {
    snapshot: {
      params: {
        'domainName': 'holy.cow',
      }
    },
    parent: {
      url: Observable.create((observer: Observer<Array<string>>) => {
        observer.next(['search', 'holy.cow']);
        observer.complete();
      })
    }
  };

  function resolveDomain(statuses: Array<string>) {
    mockDomainEppService.info.and.returnValue(Promise.resolve({
      fullyQualifiedDomainName: 'holy.cow',
      status: statuses,
      currentSponsorClientId: 'brodaddy',
      registrationExpirationTime: '2010-01-01T00:00:00Z',
    }));
  }

  function rejectDomain(message: string) {
    mockDomainEppService.info.and.returnValue(Promise.reject({
      code: '9999',
      message: message,
    }));
  }

  function verifyNoErrorMessage() {
    expect(page.getErrorMessage()).toBeFalsy('Expected no error message');
  }

  beforeEach(() => {
    // Return the promise immediately and resolve later
    TestBed.configureTestingModule({
      declarations: [ DomainInfoComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: DomainEppService, useValue: mockDomainEppService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        RouterModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainInfoComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  it('should be in an initial loading state', async(() => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(page.isLoading()).toBeTruthy('Page should be loading');
      expect(page.getDomainExpiration()).toBeFalsy('Expected no expiration in header');
      expect(page.hasInfoIcon()).toBeFalsy('Expected no info icon');
    });

  }));

  it('should not be in loading state after service promise resolves', async(() => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.isLoading()).toBeFalsy('Expected no loading div');
      verifyNoErrorMessage();
    });
  }));

  it('should show domain expiration and info icon in header after service promise resolves', async(() => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getDomainExpiration()).toBeDefined(); // No longer checking value because of timezone changes
      expect(page.hasInfoIcon()).toBeTruthy('Expected info icon');
    });
  }));

  it('should navigate back to search on dialog close', async(() => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('#domainInfoClose').click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/search/holy.cow']);
      });
    });
  }));

  it('should show an error message after service promise rejects', async(() => {
    rejectDomain('You broke it!');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(page.getErrorMessage()).toBe('You broke it!');
    });
  }));

  // TODO: test click domain info icon

});
