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
export function extractText(result: any, path: string): string {
  return extractField(result, path, 'keyValue');
}

/**
  * Attempt to get the statuses at the specified path
  *
  * @param result Result object that may contain the statuses
  * @param path Path to statuses
  * @return Array of any statuses found, or an empty array if none were found.
  */
export function extractStatuses(result: any, path: string): Array<string> {
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
export function extractType(result: any, path: string): string {
  return extractField(result, path, '@type');
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

function extractField(result: any, path: string, fieldKey: string): string {
  if (result[path]) {
    return result[path][fieldKey] || '';
  }
  return '';
}
