const eppDomainsDb: {[key: string]: string} = {
  'dev.dev': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<epp xmlns:domain="urn:ietf:params:xml:ns:domain-1.0"
  xmlns="urn:ietf:params:xml:ns:epp-1.0"
  xmlns:fee="urn:ietf:params:xml:ns:fee-0.6">
    <response>
        <result code="1000">
            <msg>Command completed successfully</msg>
        </result>
        <resData>
            <domain:infData>
                <domain:name>dev.dev</domain:name>
                <domain:roid>3617A81-dev</domain:roid>
                <domain:registrant>bobby</domain:registrant>
                <domain:clID>brodaddy</domain:clID>
            </domain:infData>
        </resData>
        <extension>
            <fee:infData>
                <fee:currency>USD</fee:currency>
                <fee:command>renew</fee:command>
                <fee:period unit="y">1</fee:period>
                <fee:fee description="renew">8.00</fee:fee>
            </fee:infData>
        </extension>
        <trID>
            <clTRID>WBP-00000</clTRID>
            <svTRID>xX0aC8j4QvCeBmlFtYtokg==-356</svTRID>
        </trID>
    </response>
</epp>`,
};

export function getDomainEpp(domainName: string): string {
  return eppDomainsDb[domainName];
}
