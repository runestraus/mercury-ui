const eppContactsDb: {[key: string]: string} = {
  'bobby': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<epp xmlns:contact="urn:ietf:params:xml:ns:contact-1.0"
  xmlns="urn:ietf:params:xml:ns:epp-1.0">
    <response>
        <result code="1000">
            <msg>Command completed successfully</msg>
        </result>
        <resData>
            <contact:infData>
                <contact:id>bobby</contact:id>
                <contact:roid>3C6CC01-ROID</contact:roid>
                <contact:status s="ok"/>
                <contact:status s="linked"/>
                <contact:postalInfo type="int">
                    <contact:name>Bob Smith</contact:name>
                    <contact:addr>
                        <contact:street></contact:street>
                        <contact:street></contact:street>
                        <contact:street></contact:street>
                        <contact:city>Tacoma</contact:city>
                        <contact:cc>US</contact:cc>
                    </contact:addr>
                </contact:postalInfo>
                <contact:voice/>
                <contact:fax/>
                <contact:email>asdf@dsfs.co</contact:email>
                <contact:clID>brodaddy</contact:clID>
                <contact:crID>brodaddy</contact:crID>
                <contact:crDate>2017-04-05T18:53:51Z</contact:crDate>
            </contact:infData>
        </resData>
        <trID>
            <clTRID>WBP-00000</clTRID>
            <svTRID>xX0aC8j4QvCeBmlFtYtokg==-357</svTRID>
        </trID>
    </response>
</epp>`,
};

export function getContactEpp(contactId: string): string {
  return eppContactsDb[contactId];
}
