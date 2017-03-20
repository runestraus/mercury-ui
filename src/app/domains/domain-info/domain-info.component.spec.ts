import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { DomainEppService } from '../../service/domain-epp.service';
import { DomainInfoComponent } from './domain-info.component';

describe('DomainInfoComponent', () => {
  let component: DomainInfoComponent;
  let fixture: ComponentFixture<DomainInfoComponent>;

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
    }));
  }

  function rejectDomain(message: string) {
    mockDomainEppService.info.and.returnValue(Promise.reject({
      code: '9999',
      message: message,
    }));
  }

  function verifyNoErrorMessage() {
    expect(fixture.debugElement.query(By.css('#domainInfoError'))).toBeFalsy('Expected no error message');
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
  });

  it('should be in an initial loading state', () => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('div#domainInfoLoading'))).toBeTruthy('Expected loading div');
  });

  it('should not be in loading state after service promise resolves', async(() => {
    resolveDomain(['ok']);
    fixture.detectChanges();
    // expect(fixture.debugElement.query(By.css('div#domainInfoLoading'))).toBeFalsy('Expected no loading div');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('div#domainInfoLoading'))).toBeFalsy('Expected no loading div');
      verifyNoErrorMessage();
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
      expect(fixture.debugElement.query(By.css('#domainInfoError')).nativeElement.textContent).toBe('You broke it!');
    });
  }));
});
