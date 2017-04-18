import { getParentRouteUrl } from './routeutils';
import {extractSld} from './dpmlUtils';

describe('getParentRouteUrl', () => {
  let sld = 'sld';
  let domainName = sld + '.tld';
  it('should return sld string from sld.tld domain name', () => {
    expect(extractSld(domainName)).toBe(sld);
  });

  sld = 'o';
  domainName = sld + '.tld';
  it('should return sld string from sld tld domain name', () => {
    expect(extractSld(domainName)).toBe(sld);
  });

  it('should return null string from null domain name', () => {
    expect(extractSld(null)).toBe(null);
  });

  it('should return null from empty string domain name', () => {
    expect(extractSld('')).toBe(null);
  });
});
