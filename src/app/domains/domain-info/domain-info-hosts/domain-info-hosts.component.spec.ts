import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Observer } from 'rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DomainDetail } from '../../../model/domain.model';
import { DisplayListComponent } from '../../../shared/components/display-list/display-list.component';
import { DomainInfoHostsComponent } from './domain-info-hosts.component';
import { DocQuery } from '../../../shared/testutils';
import { DebugElement } from '@angular/core';

class Page {
  query: DocQuery<DomainInfoHostsComponent>;

  constructor(private fixture: ComponentFixture<DomainInfoHostsComponent>) {
    this.query = new DocQuery(fixture);
  }

  getElementByCss(selector: string): DebugElement {
    const el = this.query.getElementByCss(selector);
    expect(el).toBeTruthy('Element not found: ' + selector);
    return el;
  }

  countHostLinks(): number {
    return this.query.getElementsByCss('[data-role=list-item]').length;
  }

  getHostLinkContent(num: number): string {
    const el = this.query.getElementByCss('#list-item-' + num);
    return el ? el.nativeElement.textContent : null;
  }

  getMoreHostsContent(): string {
    const el = this.query.getElementByCss('[data-role=more-list-items]');
    return el ? el.nativeElement.textContent : null;
  }

  clickHostLink(num: number): void {
    this.getElementByCss('#list-item-' + num).nativeElement.click();
  }
}

describe('DomainInfoHostsComponent', () => {
  let component: DomainInfoHostsComponent;
  let fixture: ComponentFixture<DomainInfoHostsComponent>;
  let page: Page;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainInfoHostsComponent, DisplayListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: mockRoute}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainInfoHostsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  it('should show a list of nameservers', () => {
    component.domain = {
      nameservers: ['ns1.foo.bar', 'ns2.foo.bar', 'ns3.foo.bar', 'ns4.foo.bar'],
    } as DomainDetail;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      // only shows first two + "more..." link
      expect(page.countHostLinks()).toBe(2);
      expect(page.getHostLinkContent(0)).toBe('ns1.foo.bar');
      expect(page.getHostLinkContent(1)).toBe('ns2.foo.bar');
      expect(page.getMoreHostsContent()).toBe('2 more...');
    });
  });

  // TODO: test edit host link
  it('should navigate to edit host modal when host link is clicked', () => {
    component.domain = {
      nameservers: ['ns1.foo.bar', 'ns2.foo.bar', 'ns3.foo.bar', 'ns4.foo.bar'],
    } as DomainDetail;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page.clickHostLink(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['hosts/ns2.foo.bar'], {relativeTo: mockRoute});
    });
  });

  // TODO: test click 'more' link edits host list

  // TODO: click edit hosts button
});
