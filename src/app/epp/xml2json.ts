const parser = new DOMParser();

/**
 * Turns XML document into a JSON data structure. This function is similar to
 * <a href="https://developer.mozilla.org/en-US/docs/JXON">Mozilla JXON</a>
 * except it handles text differently. This routine does not coerce string types to
 * number, boolean, or null.
 *
 * @param xml Xml document
 * @return Object Javascript object representation of xml
 */
export function convertToJson(xml: string): Object {
  const document = parser.parseFromString(xml, 'text/xml');
  const node = document.firstChild;
  const result = {};
  result[node.nodeName] = convertNodeToJson(node);
  return result;
}

function convertNodeToJson(node: Node): Object {
  const result = {};
  if (node.hasAttributes()) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes.item(i);
      result['@' + attr.name] = attr.value || '';
    }
  }
  for (let j = 0; j < node.childNodes.length; j++) {
    const child = node.childNodes.item(j);
    switch (child.nodeType) {
      case Node.TEXT_NODE:
      case Node.CDATA_SECTION_NODE:
        const text = child.nodeValue.trim();
        if (text !== '') {
          result['keyValue'] = text;
        }
        break;
      case Node.ELEMENT_NODE:
        const json = convertNodeToJson(child);
        const name = child.nodeName;
        if (name in result) {
          const field = result[name];
          if (Array.isArray(field)) {
            field.push(json);
          } else {
            result[name] = [field, json];
          }
        } else {
          result[name] = json;
        }
        break;
    }
  }
  return result;
}
