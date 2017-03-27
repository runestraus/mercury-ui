import { ActivatedRoute, Router } from '@angular/router';

/** Gets the parent route's url as a string */
export function getParentRouteUrl(route: ActivatedRoute): string {
  let url = '';
  while (route.parent) {
    route = route.parent;
    route.url.map(segments => '/' + segments.join('/')).forEach(u => {
      url = u + url;
    });
  }
  return url;
}
