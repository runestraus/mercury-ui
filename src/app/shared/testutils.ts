import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core/index';

/** Provides convenience methods for querying a ComponentFixture */
export class DocQuery<T> {

  constructor(private fixture: ComponentFixture<T>) {}

  getElementByCss(selector: string): DebugElement {
    return this.fixture.debugElement.query(By.css(selector));
  }

  getElementsByCss(selector: string): DebugElement[] {
    return this.fixture.debugElement.queryAll(By.css(selector));
  }
}
