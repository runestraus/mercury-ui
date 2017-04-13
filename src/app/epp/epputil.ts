/**
  * Attempt to get the value of @x at the specified path
  *
  * @param result Result object that may contain the field value
  * @param path Path to field
  * @return Value of @x attribute if found, otherwise empty string.
  */
export function extractExtension(result: any, path: string): string {
  return extractField(result, path, '@x');
}

/**
  * Attempt to get the value of text content at the specified path
  *
  * @param result Result object that may contain the field value
  * @param path Path to field
  * @return Value of text content if found, otherwise empty string.
  */
export function extractText(result: any, ...path: string[]): string {
  return extractField(result, ...path, 'keyValue');
}

/**
 * Attempt to get a boolean value at the specified path
 *
 * @param result Result object that may contain the field value
 * @param path Path to field
 * @returns {boolean} true if value is 'true' else false
 */
export function extractBoolean(result: any, ...path: string[]): boolean {
  const value = extractField(result, ...path);
  return value === 'true';
}

/**
 * Attempt to get an array value at the specified path
 *
 * @param result Result object that may contain the field value
 * @param path Path to field
 * @returns string[] found or an empty array
 */
export function extractArray(result: any, ...path: string[]): string[] {
  // element isn't in the result so return an empty array
  if (!(path[0] in result)) {
    return [];
  }
  // element we were looking for so return
  if (path.length === 1) {
    if (!Array.isArray(result[path[0]])) {
      return [result[path[0]]['keyValue']];
    }
    return result[path[0]].map(item => extractText(item));
  }
  return extractArray(result[path[0]], ...path.slice(1, path.length + 1));
}

/**
  * Attempt to get the statuses at the specified path
  *
  * @param result Result object that may contain the statuses
  * @param path Path to statuses
  * @return Array of any statuses found, or an empty array if none were found.
  */
export function extractStatuses(result: any, path: string): Array<string> {
  // element isn't in the result so return an empty array
  if (!(path in result)) {
    return [];
  }
  let status = result[path];
  if (!Array.isArray(status)) {
    status = [ status ];
  }
  return status.map(element => {
    return element['@s'];
  });
}

/**
  * Attempt to get the value of @type at the specified path
  *
  * @param result Result object that may contain the field value
  * @param path Path to field
  * @return Value of @type if found, otherwise empty string.
  */
export function extractType(result: any, ...path: string[]): string {
  return extractField(result, ...path, '@type');
}

/**
 * Attempt to get a set of types and values at a specified path
 *
 * @param result Result object that may contain the field value
 * @param path Path to field containing array of types
 * @return type: value dictionary (string:string)
 */
export function extractTypes(result: any, ...path: string[]): {[key: string]: string} {
  // element isn't in the result so return an empty dictionary
  if (!(path[0] in result)) {
    return {};
  }
  // element we were looking for so return
  if (path.length === 1) {
    return result[path[0]].reduce((o, item) => {
      o[extractType(item)] = extractText(item);
      return o;
    }, {});
  }
  return extractTypes(result[path[0]], ...path.slice(1, path.length + 1));
}

/**
  * Attempt to get the value of @avail at the specified path
  *
  * @param result Result object that may contain the field value
  * @param path Path to field
  * @return Value of @avail if found, otherwise empty string.
  */
export function extractAvail(result: any, path: string): boolean {
  return extractField(result, path, '@avail') === 'true';
}

/**
  * Attempt to get the field at the specified path
  *
  * @param result Result object that may contain the fields
  * @param path Path to fields
  * @return Value of the field if found, otherwise an empty string
  */
export function extractField(result: any, ...path: string[]): string {
  // element isn't in the result so return an empty string
  if (!(path[0] in result)) {
    return '';
  }
  // element we were looking for so return
  if (path.length === 1) {
    return result[path[0]];
  }
  return extractField(result[path[0]], ...path.slice(1, path.length + 1));
}
