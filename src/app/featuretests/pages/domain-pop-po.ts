import { DocQuery } from '../../shared/testutils';
import {
  tick, ComponentFixture
} from '@angular/core/testing';
import { AppComponent } from '../../app.component';
import { DebugElement } from '@angular/core';

export class DomainPopupPage {
  query: DocQuery<AppComponent>;

  constructor(
      private fixture: ComponentFixture<AppComponent>) {
    this.query = new DocQuery(fixture);
  }

  private getElementByCss(selector: string): DebugElement {
    const el = this.query.getElementByCss(selector);
    expect(el).toBeTruthy();
    return el;
  }

  getHeaderDomainName(): string {
    const el = this.query.getElementByCss('#domain-info-header');
    return el == null ? null : el.nativeElement.textContent.trim();
  }

  getDisplayedContactName(contactId: string): string {
    const el = this.query.getElementByCss(`#contact-name-${contactId}`);
    return el == null ? null : el.nativeElement.textContent.trim();
  }

  getDisplayedContactType(contactId: string): string {
    const el = this.query.getElementByCss(`#contact-type-${contactId}`);
    return el == null ? null : el.nativeElement.textContent.trim();
  }
}
