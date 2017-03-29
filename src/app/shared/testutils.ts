import { ActivatedRoute, UrlSegment } from '@angular/router';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core/index';
import { Observable } from 'rxjs/Rx';

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

/** Creates a mock route that should resemble what is expected from angular */
export function createMockRoute(path: Array<string>, snapshotParams?: {[key: string]: string}): ActivatedRoute {
  if (path.length === 0) {
    return null;
  }
  snapshotParams = snapshotParams || {};
  const urlSegments = path[path.length - 1].split('/').map(pathSegment => {
    return new UrlSegment(pathSegment, {});
  });
  return {
    url: Observable.from([urlSegments]),
    parent: createMockRoute(path.slice(0, path.length - 1)),
    snapshot: {
      params: snapshotParams,
    }
  } as ActivatedRoute;
}
