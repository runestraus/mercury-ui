import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core/index';

import { DomainDetail } from '../../../model/domain.model';
import { DisplayListComponent } from '../../../shared/components/display-list/display-list.component';
import { DomainInfoHostsComponent } from './domain-info-hosts.component';
import { DocQuery } from '../../../shared/testutils';

class Page {
  query: DocQuery<DomainInfoHostsComponent>;

  constructor(private fixture: ComponentFixture<DomainInfoHostsComponent>) {
    this.query = new DocQuery(fixture);
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
}

describe('DomainInfoHostsComponent', () => {
  let component: DomainInfoHostsComponent;
  let fixture: ComponentFixture<DomainInfoHostsComponent>;
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainInfoHostsComponent, DisplayListComponent ]
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

  // TODO: test click 'more' link edits host list
});
