import { convertToJson } from './xml2json';

describe('convertToJson', () => {
  it('should parse a block of xml', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <epp xmlns="urn:ietf:params:xml:ns:epp-1.0">
            <response>
              <result code="1000">
                <msg>Command completed successfully</msg>
              </result>
              <trID>
                <clTRID>WBP-00000</clTRID>
                <svTRID>pw1k4BeCS9ekvfP6LfAVSg==-1</svTRID>
              </trID>
            </response>
          </epp>`;
    expect(JSON.stringify(convertToJson(xml), null, 2)).toBe(
      `{
  "epp": {
    "@xmlns": "urn:ietf:params:xml:ns:epp-1.0",
    "response": {
      "result": {
        "@code": "1000",
        "msg": {
          "keyValue": "Command completed successfully"
        }
      },
      "trID": {
        "clTRID": {
          "keyValue": "WBP-00000"
        },
        "svTRID": {
          "keyValue": "pw1k4BeCS9ekvfP6LfAVSg==-1"
        }
      }
    }
  }
}`);
  });
});
