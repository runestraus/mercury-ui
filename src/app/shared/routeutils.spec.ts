import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { getParentRouteUrl } from './routeutils';

/** Creates a mock route that should resemble what is expected from angular */
function createRoute(path: Array<string>): ActivatedRoute {
  if (path.length === 0) {
    return null;
  }
  const urlSegments = path[path.length - 1].split('/').map(pathSegment => {
    return new UrlSegment(pathSegment, {});
  });
  return {
    url: Observable.from([urlSegments]),
    parent: createRoute(path.slice(0, path.length - 1))
  } as ActivatedRoute;
}

describe('getParentRouteUrl', () => {

  it('should return an empty string for root url', () => {
    expect(getParentRouteUrl(createRoute(['/']))).toBe('');
  });

  it('should return an empty string for a route with no parents', () => {
    expect(getParentRouteUrl(createRoute(['foo/bar']))).toBe('');
  });

  it('should return parent url for a route with one parent', () => {
    expect(getParentRouteUrl(createRoute(['foo/bar', 'bazz']))).toBe('/foo/bar');
  });

  it('should return parent url for a route with two parents', () => {
    expect(getParentRouteUrl(createRoute(['foo/bar', 'bazz', '123/info']))).toBe('/foo/bar/bazz');
  });

  it('should return parent url for a route with a ridiculously large number of segments', () => {
    expect(getParentRouteUrl(createRoute(['1', '2/3', '4/5/6', '7/8/9/0', 'a/b/c/d/e/f/g'])))
      .toBe('/1/2/3/4/5/6/7/8/9/0');
  });
});
