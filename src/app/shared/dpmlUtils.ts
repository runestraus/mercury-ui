/**
 * Extract Sld name from domain name. Sld must be more than 2 characters
 *
 * @param domainName - domain name.
 * @return String Sld name.
 */
export function extractSld(domainName: string): string {
  let tld: string = null;
  if (domainName !== null && domainName.indexOf('.') > 0) {
    tld = domainName.substring(0, domainName.indexOf('.'));
  }
  return tld;
}
