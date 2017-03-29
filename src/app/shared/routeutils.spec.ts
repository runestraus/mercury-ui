import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { getParentRouteUrl } from './routeutils';
import { createMockRoute } from './testutils';

describe('getParentRouteUrl', () => {

  it('should return an empty string for root url', () => {
    expect(getParentRouteUrl(createMockRoute(['/']))).toBe('');
  });

  it('should return an empty string for a route with no parents', () => {
    expect(getParentRouteUrl(createMockRoute(['foo/bar']))).toBe('');
  });

  it('should return parent url for a route with one parent', () => {
    expect(getParentRouteUrl(createMockRoute(['foo/bar', 'bazz']))).toBe('/foo/bar');
  });

  it('should return parent url for a route with two parents', () => {
    expect(getParentRouteUrl(createMockRoute(['foo/bar', 'bazz', '123/info']))).toBe('/foo/bar/bazz');
  });

  it('should return parent url for a route with a ridiculously large number of segments', () => {
    expect(getParentRouteUrl(createMockRoute(['1', '2/3', '4/5/6', '7/8/9/0', 'a/b/c/d/e/f/g'])))
      .toBe('/1/2/3/4/5/6/7/8/9/0');
  });
});
