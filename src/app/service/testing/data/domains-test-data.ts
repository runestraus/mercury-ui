/**
 * Copyright 2016 The Domain Registry Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const testDataDomainDomain = {
  'fullyQualifiedDomainName': 'domain.domain',
  'repoId': 'y5s76fgo8h',
  'status': [
    'clientTransferProhibited',
    'clientUpdateProhibited',
    'clientDeleteProhibited'
  ],
  statusType: 'client',
  'contacts': {
    'registrant': 'donuts_300',
    'admin': 'donuts_300',
    'tech': 'donuts_300',
    'billing': 'donuts_300'
  },
  'nameservers': [
    'ns1.domain.domain',
    'ns2.domain.domain'
  ],
  'subordinateHosts': [
    'www.domain.domain',
    'mail.domain.domain'
  ],
  'currentSponsorClientId': 'donuts_300',
  'creationClientId': 'donuts_301',
  'creationTime': '2006-11-11T19:22:10+00:00',
  'lastEppUpdateClientId': 'donuts_302',
  'lastEppUpdateTime': '2009-08-19T21:17:32+00:00',
  'registrationExpirationTime': '2016-05-15T11:34:54+00:00',
  'lastTransferTime': '2011-02-02T21:40:31+00:00',
  'DNSSecRecords': 'No DnsSec records.',
  'authInfo': {
    'pw': '74s867f87g9uh'
  },
  'price': {
    'name': 'BB+',
    'CreatePrice': '31.00',
    'RenewPrice': '32.00',
    'RestorePrice': '40.00',
    'TransferPrice': '33.00'
  }
};

export const infoForDomainDomainResponse = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'The command completed successfully'
        }
      },
      resData: {
        'domain:infData': {
          'domain:name': {
            'keyValue': 'domain.domain'
          },
          'domain:status': [
            {
              '@s': 'clientTransferProhibited'
            },
            {
              '@s': 'clientUpdateProhibited'
            },
            {
              '@s': 'clientDeleteProhibited'
            }
          ],
          'domain:roid': {
            'keyValue': 'y5s76fgo8h'
          },
          'domain:clID': {
            'keyValue': 'donuts_300'
          },
          'domain:crID': {
            'keyValue': 'donuts_301'
          },
          'domain:crDate': {
            'keyValue': '2006-11-11T19:22:10+00:00'
          },
          'domain:upID': {
            'keyValue': 'donuts_302'
          },
          'domain:upDate': {
            'keyValue': '2009-08-19T21:17:32+00:00'
          },
          'domain:trDate': {
            'keyValue': '2011-02-02T21:40:31+00:00'
          },
          'domain:exDate': {
            'keyValue': '2016-05-15T11:34:54+00:00'
          },
          'domain:registrant': {
            'keyValue': 'donuts_300'
          },
          'domain:authInfo': {
            'domain:pw': {
              'keyValue': '54as78659df0879gh8'
            }
          },
          'domain:contact': [
            {
              '@type': 'admin',
              'keyValue': 'donuts_300'
            },
            {
              '@type': 'tech',
              'keyValue': 'donuts_300'
            },
            {
              '@type': 'billing',
              'keyValue': 'donuts_300'
            }
          ],
          'domain:host': [
            {
              'keyValue': 'www.domain.domain'
            },
            {
              'keyValue': 'mail.domain.domain'
            }
          ],
          'domain:ns': {
            'domain:hostObj': [
              {
                'keyValue': 'ns1.domain.domain'
              },
              {
                'keyValue': 'ns2.domain.domain'
              }
            ]
          }
        },
        'contact:infData': {
          'contact:id': {
            'keyValue': 'donuts_999'
          },
          'contact:status': [
            {
              '@s': 'clientDeleteProhibited'
            },
            {
              '@s': 'linked'
            }
          ],
          'contact:roid': {
            'keyValue': '999'
          },
          'contact:clID': {
            'keyValue': 'donuts_042'
          },
          'contact:crID': {
            'keyValue': 'donuts_043'
          },
          'contact:crDate': {
            'keyValue': '2012-04-16T16:02:47Z'
          },
          'contact:upID': {
            'keyValue': 'donuts_044'
          },
          'contact:upDate': {
            'keyValue': '2012-04-16T16:02:47Z'
          },
          'contact:trDate': {
            'keyValue': '2009-10-16T19:05:21+00:00'
          },
          'contact:voice': {
            '@x': '1234',
            'keyValue': '+1.2025551212'
          },
          'contact:fax': {
            'keyValue': '+1.2024567890'
          },
          'contact:email': {
            'keyValue': 'fnord@example.com'
          },
          'contact:authInfo': {
            'contact:pw': {
              'keyValue': '54as78659df0879gh8'
            }
          },
          'contact:postalInfo': [
            {
              '@type': 'loc',
              'contact:name': {
                'keyValue': 'Bœb Dobbs, Jr.'
              },
              'contact:org': {
                'keyValue': 'SübGenius'
              },
              'contact:addr': {
                'contact:street': [
                  { 'keyValue': '42 Fnørd Parkway' },
                  { 'keyValue': 'Ste. 123' }
                ],
                'contact:city': {
                  'keyValue': 'Fnördenburg'
                },
                'contact:sp': {
                  'keyValue': 'CA'
                },
                'contact:pc': {
                  'keyValue': '11235'
                },
                'contact:cc': {
                  'keyValue': 'US'
                }
              }
            },
            {
              '@type': 'int',
              'contact:name': {
                'keyValue': 'Bob Dobbs, Jr. int'
              },
              'contact:org': {
                'keyValue': 'SubGenius'
              },
              'contact:addr': {
                'contact:street': [
                  { 'keyValue': '42 Fnord Parkway' },
                  { 'keyValue': 'Ste. 123' }
                ],
                'contact:city': {
                  'keyValue': 'Fnordenburg'
                },
                'contact:sp': {
                  'keyValue': 'CA'
                },
                'contact:pc': {
                  'keyValue': '11235'
                },
                'contact:cc': {
                  'keyValue': 'US'
                }
              }
            }
          ]
        }
      },
      extension: {
        'fee:infData': {
          'fee:currency': {
            'keyValue': 'USD'
          },
          'fee:command': {
            'keyValue': 'renew'
          },
          'fee:period': {
            'keyValue': '1',
            '@unit': 'y'
          },
          'fee:fee': {
            'keyValue': '8.00',
            '@description': 'renew'
          }
        }
      }
    }
  }
};

export const infoForPremiumDomainInAddPeriodResponse = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'The command completed successfully'
        }
      },
      resData: {
        'domain:infData': {
          'domain:name': {
            'keyValue': 'premium.domain'
          },
          'domain:status': [
            {
              '@s': 'clientTransferProhibited'
            },
            {
              '@s': 'clientUpdateProhibited'
            },
            {
              '@s': 'clientDeleteProhibited'
            }
          ],
          'domain:roid': {
            'keyValue': 'y5s76fgo8h'
          },
          'domain:clID': {
            'keyValue': 'donuts_300'
          },
          'domain:crID': {
            'keyValue': 'donuts_301'
          },
          'domain:crDate': {
            'keyValue': '2006-11-11T19:22:10+00:00'
          },
          'domain:upID': {
            'keyValue': 'donuts_302'
          },
          'domain:upDate': {
            'keyValue': '2009-08-19T21:17:32+00:00'
          },
          'domain:trDate': {
            'keyValue': '2011-02-02T21:40:31+00:00'
          },
          'domain:exDate': {
            'keyValue': '2016-05-15T11:34:54+00:00'
          },
          'domain:registrant': {
            'keyValue': 'donuts_300'
          },
          'domain:authInfo': {
            'domain:pw': {
              'keyValue': '54as78659df0879gh8'
            }
          },
          'domain:contact': [
            {
              '@type': 'admin',
              'keyValue': 'donuts_301'
            },
            {
              '@type': 'tech',
              'keyValue': 'donuts_302'
            },
            {
              '@type': 'billing',
              'keyValue': 'donuts_303'
            }
          ],
          'domain:host': [
            {
              'keyValue': 'www.domain.domain'
            },
            {
              'keyValue': 'mail.domain.domain'
            }
          ],
          'domain:ns': {
            'domain:hostObj': [
              {
                'keyValue': 'ns1.domain.domain'
              },
              {
                'keyValue': 'ns2.domain.domain'
              }
            ]
          }
        },
        'contact:infData': {
          'contact:id': {
            'keyValue': 'donuts_999'
          },
          'contact:status': [
            {
              '@s': 'clientDeleteProhibited'
            },
            {
              '@s': 'linked'
            }
          ],
          'contact:roid': {
            'keyValue': '999'
          },
          'contact:clID': {
            'keyValue': 'donuts_042'
          },
          'contact:crID': {
            'keyValue': 'donuts_043'
          },
          'contact:crDate': {
            'keyValue': '2012-04-16T16:02:47Z'
          },
          'contact:upID': {
            'keyValue': 'donuts_044'
          },
          'contact:upDate': {
            'keyValue': '2012-04-16T16:02:47Z'
          },
          'contact:trDate': {
            'keyValue': '2009-10-16T19:05:21+00:00'
          },
          'contact:voice': {
            '@x': '1234',
            'keyValue': '+1.2025551212'
          },
          'contact:fax': {
            'keyValue': '+1.2024567890'
          },
          'contact:email': {
            'keyValue': 'fnord@example.com'
          },
          'contact:authInfo': {
            'contact:pw': {
              'keyValue': '54as78659df0879gh8'
            }
          },
          'contact:postalInfo': [
            {
              '@type': 'loc',
              'contact:name': {
                'keyValue': 'Bœb Dobbs, Jr.'
              },
              'contact:org': {
                'keyValue': 'SübGenius'
              },
              'contact:addr': {
                'contact:street': [
                  { 'keyValue': '42 Fnørd Parkway' },
                  { 'keyValue': 'Ste. 123' }
                ],
                'contact:city': {
                  'keyValue': 'Fnördenburg'
                },
                'contact:sp': {
                  'keyValue': 'CA'
                },
                'contact:pc': {
                  'keyValue': '11235'
                },
                'contact:cc': {
                  'keyValue': 'US'
                }
              }
            },
            {
              '@type': 'int',
              'contact:name': {
                'keyValue': 'Bob Dobbs, Jr. int'
              },
              'contact:org': {
                'keyValue': 'SubGenius'
              },
              'contact:addr': {
                'contact:street': [
                  { 'keyValue': '42 Fnord Parkway' },
                  { 'keyValue': 'Ste. 123' }
                ],
                'contact:city': {
                  'keyValue': 'Fnordenburg'
                },
                'contact:sp': {
                  'keyValue': 'CA'
                },
                'contact:pc': {
                  'keyValue': '11235'
                },
                'contact:cc': {
                  'keyValue': 'US'
                }
              }
            }
          ]
        }
      },
      extension: {
        'rgp:infData': {
          'rgp:rgpStatus': {
            '@s': 'addPeriod'
          }
        },
        'fee:infData': {
          'fee:currency': {
            'keyValue': 'USD'
          },
          'fee:command': {
            'keyValue': 'renew'
          },
          'fee:period': {
            'keyValue': '1',
            '@unit': 'y'
          },
          'fee:fee': {
            'keyValue': '999.00',
            '@description': 'renew'
          },
          'fee:class': {
            'keyValue': 'premium'
          },
        }
      }
    }
  }
};

export const infoForDomainDomainPendingDeleteResponse = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'The command completed successfully'
        }
      },
      resData: {
        'domain:infData': {
          'domain:name': {
            'keyValue': 'domain.domain'
          },
          'domain:status': [
            {
              '@s': 'pendingDelete'
            },
            {
              '@s': 'inactive'
            }
          ],
          'domain:roid': {
            'keyValue': 'y5s76fgo8h'
          },
          'domain:clID': {
            'keyValue': 'donuts_300'
          },
          'domain:crID': {
            'keyValue': 'donuts_301'
          },
          'domain:crDate': {
            'keyValue': '2006-11-11T19:22:10+00:00'
          },
          'domain:upID': {
            'keyValue': 'donuts_302'
          },
          'domain:upDate': {
            'keyValue': '2009-08-19T21:17:32+00:00'
          },
          'domain:trDate': {
            'keyValue': '2011-02-02T21:40:31+00:00'
          },
          'domain:exDate': {
            'keyValue': '2016-05-15T11:34:54+00:00'
          },
          'domain:registrant': {
            'keyValue': 'donuts_300'
          },
          'domain:authInfo': {
            'domain:pw': {
              'keyValue': '54as78659df0879gh8'
            }
          },
          'domain:contact': [
            {
              '@type': 'admin',
              'keyValue': 'donuts_301'
            },
            {
              '@type': 'tech',
              'keyValue': 'donuts_302'
            },
            {
              '@type': 'billing',
              'keyValue': 'donuts_303'
            }
          ],
          'domain:host': [
            {
              'keyValue': 'www.domain.domain'
            },
            {
              'keyValue': 'mail.domain.domain'
            }
          ],
          'domain:ns': {
            'domain:hostObj': [
              {
                'keyValue': 'ns1.domain.domain'
              },
              {
                'keyValue': 'ns2.domain.domain'
              }
            ]
          }
        }
      }
    }
  }
};

export const infoForDomainDomainResponseNoArray = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'The command completed successfully'
        }
      },
      resData: {
        'domain:infData': {
          'domain:name': {
            'keyValue': 'domain.domain'
          },
          'domain:status': {
            '@s': 'clientTransferProhibited'
          },
          'domain:roid': {
            'keyValue': 'y5s76fgo8h'
          },
          'domain:clID': {
            'keyValue': 'donuts_300'
          },
          'domain:crID': {
            'keyValue': 'donuts_301'
          },
          'domain:crDate': {
            'keyValue': '2006-11-11T19:22:10+00:00'
          },
          'domain:upID': {
            'keyValue': 'donuts_302'
          },
          'domain:upDate': {
            'keyValue': '2009-08-19T21:17:32+00:00'
          },
          'domain:trDate': {
            'keyValue': '2011-02-02T21:40:31+00:00'
          },
          'domain:exDate': {
            'keyValue': '2016-05-15T11:34:54+00:00'
          },
          'domain:registrant': {
            'keyValue': 'donuts_300'
          },
          'domain:authInfo': {
            'domain:pw': {
              'keyValue': '54as78659df0879gh8'
            }
          },
          'domain:contact': {
            '@type': 'admin',
            'keyValue': 'donuts_301'
          },
          'domain:host': {
            'keyValue': 'www.domain.domain'
          },
          'domain:ns': {
            'domain:hostObj': {
              'keyValue': 'ns1.domain.domain'
            }
          }
        },
        'contact:infData': {
          'contact:id': {
            'keyValue': 'donuts_999'
          },
          'contact:status': [
            {
              '@s': 'clientDeleteProhibited'
            },
            {
              '@s': 'linked'
            }
          ],
          'contact:roid': {
            'keyValue': '999'
          },
          'contact:clID': {
            'keyValue': 'donuts_042'
          },
          'contact:crID': {
            'keyValue': 'donuts_043'
          },
          'contact:crDate': {
            'keyValue': '2012-04-16T16:02:47Z'
          },
          'contact:upID': {
            'keyValue': 'donuts_044'
          },
          'contact:upDate': {
            'keyValue': '2012-04-16T16:02:47Z'
          },
          'contact:trDate': {
            'keyValue': '2009-10-16T19:05:21+00:00'
          },
          'contact:voice': {
            '@x': '1234',
            'keyValue': '+1.2025551212'
          },
          'contact:fax': {
            'keyValue': '+1.2024567890'
          },
          'contact:email': {
            'keyValue': 'fnord@example.com'
          },
          'contact:authInfo': {
            'contact:pw': {
              'keyValue': '54as78659df0879gh8'
            }
          },
          'contact:postalInfo': [
            {
              '@type': 'loc',
              'contact:name': {
                'keyValue': 'Bœb Dobbs, Jr.'
              },
              'contact:org': {
                'keyValue': 'SübGenius'
              },
              'contact:addr': {
                'contact:street': [
                  { 'keyValue': '42 Fnørd Parkway' },
                  { 'keyValue': 'Ste. 123' }
                ],
                'contact:city': {
                  'keyValue': 'Fnördenburg'
                },
                'contact:sp': {
                  'keyValue': 'CA'
                },
                'contact:pc': {
                  'keyValue': '11235'
                },
                'contact:cc': {
                  'keyValue': 'US'
                }
              }
            },
            {
              '@type': 'int',
              'contact:name': {
                'keyValue': 'Bob Dobbs, Jr. int'
              },
              'contact:org': {
                'keyValue': 'SubGenius'
              },
              'contact:addr': {
                'contact:street': [
                  { 'keyValue': '42 Fnord Parkway' },
                  { 'keyValue': 'Ste. 123' }
                ],
                'contact:city': {
                  'keyValue': 'Fnordenburg'
                },
                'contact:sp': {
                  'keyValue': 'CA'
                },
                'contact:pc': {
                  'keyValue': '11235'
                },
                'contact:cc': {
                  'keyValue': 'US'
                }
              }
            }
          ]
        }
      }
    }
  }
};

export const infoForDomainDomainLimitedResponse = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'The command completed successfully'
        }
      },
      resData: {
        'domain:infData': {
          'domain:name': {
            'keyValue': 'domain.domain'
          },
          'domain:clID': {
            'keyValue': 'donuts_300'
          },
          'domain:roid': {
            'keyValue': 'y5s76fgo8h'
          }
        }
      }
    }
  }
};

export const testDataUnavailableDomain = {
  'fullyQualifiedDomainName': 'unavailable.domain',
  'avail': false,
  'reason': 'We don\'t serve your kind around here',
  'price': {
    'name': 'BB+',
    'CreatePrice': '33.00',
    'RenewPrice': '34.00',
    'RestorePrice': '45.00',
    'TransferPrice': '36.00'
  }
};

export const checkForUnavailableDomainResponse = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'The command completed successfully'
        }
      },
      resData: {
        'domain:chkData': {
          'domain:cd': {
            'domain:name': {
              '@avail': 'false',
              'keyValue': 'unavailable.domain'
            },
            'domain:reason': {
              'keyValue': 'We don\'t serve your kind around here'
            }
          }
        }
      }
    }
  }
};

export const testDataAvailableDomain = {
  'fullyQualifiedDomainName': 'available.domain',
  'avail': true,
  'price': {
    'name': 'BB+',
    'CreatePrice': '31.00',
    'RenewPrice': '32.00',
    'RestorePrice': '40.00',
    'TransferPrice': '33.00'
  }
};

export const checkForAvailableDomainResponse = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'The command completed successfully'
        }
      },
      resData: {
        'domain:chkData': {
          'domain:cd': {
            'domain:name': {
              '@avail': 'true',
              'keyValue': 'available.domain'
            }
          }
        }
      },
      extension: {
        'fee:chkData': {
          'fee:cd': [
            {
              'fee:command': { 'keyValue': 'create' },
              'fee:currency': { 'keyValue': 'USD' },
              'fee:name': { 'keyValue': 'available.domain' },
              'fee:period': { 'keyValue': '1', '@unit': 'y' },
              'fee:fee': { 'keyValue': '8.00', '@description': 'create' }
            },
            {
              'fee:command': { 'keyValue': 'renew' },
              'fee:currency': { 'keyValue': 'USD' },
              'fee:name': { 'keyValue': 'available.domain' },
              'fee:period': { 'keyValue': '1', '@unit': 'y' },
              'fee:fee': { 'keyValue': '8.00', '@description': 'renew' }
            },
            {
              'fee:command': { 'keyValue': 'transfer' },
              'fee:currency': { 'keyValue': 'USD' },
              'fee:name': { 'keyValue': 'available.domain' },
              'fee:period': { 'keyValue': '1', '@unit': 'y' },
              'fee:fee': { 'keyValue': '8.00', '@description': 'renew' }
            },
            {
              'fee:command': { 'keyValue': 'restore' },
              'fee:currency': { 'keyValue': 'USD' },
              'fee:name': { 'keyValue': 'available.domain' },
              'fee:period': { 'keyValue': '1', '@unit': 'y' },
              'fee:fee': [
                { 'keyValue': '100.00', '@description': 'restore' }, { 'keyValue': '8.00', '@description': 'renew' }
              ]
            },
          ]
        }
      }
    }
  }
};

export const checkForAvailablePremiumDomainResponse = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'The command completed successfully'
        }
      },
      resData: {
        'domain:chkData': {
          'domain:cd': {
            'domain:name': {
              '@avail': 'true',
              'keyValue': 'premium.domain'
            }
          }
        }
      },
      extension: {
        'fee:chkData': {
          'fee:cd': [
            {
              'fee:command': { 'keyValue': 'create' },
              'fee:class': { 'keyValue': 'premium' },
              'fee:currency': { 'keyValue': 'USD' },
              'fee:name': { 'keyValue': 'available.domain' },
              'fee:period': { 'keyValue': '1', '@unit': 'y' },
              'fee:fee': { 'keyValue': '999.00', '@description': 'create' }
            },
            {
              'fee:command': { 'keyValue': 'renew' },
              'fee:class': { 'keyValue': 'premium' },
              'fee:currency': { 'keyValue': 'USD' },
              'fee:name': { 'keyValue': 'available.domain' },
              'fee:period': { 'keyValue': '1', '@unit': 'y' },
              'fee:fee': { 'keyValue': '999.00', '@description': 'renew' }
            },
            {
              'fee:command': { 'keyValue': 'transfer' },
              'fee:class': { 'keyValue': 'premium' },
              'fee:currency': { 'keyValue': 'USD' },
              'fee:name': { 'keyValue': 'available.domain' },
              'fee:period': { 'keyValue': '1', '@unit': 'y' },
              'fee:fee': { 'keyValue': '999.00', '@description': 'renew' }
            },
            {
              'fee:command': { 'keyValue': 'restore' },
              'fee:class': { 'keyValue': 'premium' },
              'fee:currency': { 'keyValue': 'USD' },
              'fee:name': { 'keyValue': 'available.domain' },
              'fee:period': { 'keyValue': '1', '@unit': 'y' },
              'fee:fee': [
                { 'keyValue': '100.00', '@description': 'restore' }, { 'keyValue': '999.00', '@description': 'renew' }
              ]
            },
          ]
        }
      }
    }
  }
};

export const checkForAvailableDomainResponseArray = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'The command completed successfully'
        }
      },
      resData: {
        'domain:chkData': {
          'domain:cd': [
            {
              'domain:name': {
                '@avail': 'true',
                'keyValue': 'available.domain'
              }
            },
            {
              'domain:name': {
                '@avail': 'true',
                'keyValue': 'anotheravailable.domain'
              }
            },
          ]
        }
      }
    }
  }
};

export const testDataObjectNotFound = {
  'data': {
    'status': 'FAILURE',
    'statusMessage': 'Object Not Found'
  },
  'status': 404
};

export const testData404ObjectNotFound = {
  'status': 'FAILURE',
  'statusMessage': 'Object Not Found'
};

export const infoForNonExistantDomainResponse = {
  epp: {
    response: {
      result: {
        '@code': '2303',
        'msg': {
          'keyValue': 'The domain with given ID (domain.domain) doesn\'t exist.'
        }
      }
    }
  }
};

export const newDomainSuccessDialogResultNewDomain = {
  'itemName': 'new.domain',
  'actionStatus': true
};

export const createDomainFormResult = {
  'fullyQualifiedDomainName': 'domain.domain',
  'status': [
    'CLIENT_TRANSFER_PROHIBITED',
    'CLIENT_UPDATE_PROHIBITED',
    'CLIENT_DELETE_PROHIBITED'
  ],
  'domainNameservers': [
    'ns1.domain.domain',
    'ns2.domain.domain'
  ],
  'authInfo': '12345',
  'language': 'en_US',
  'registrationPeriod': '1',
  'registrantContact': 'donuts_120',
  'billingContact': 'donuts_121',
  'adminContact': 'donuts_122',
  'techContact': 'donuts_123',
  'itemName': 'domain.domain',
  'registrationYears': {
    id: 2,
    text: '2 years'
  }
};

export const domainInfoBarAuthCode = {
  'fullyQualifiedDomainName': 'badauthcode.domain',
  'reason': 'The authorization code did not match.'
};

export const infoWithBadAuthCodeResponse = {
  epp: {
    response: {
      result: {
        '@code': '2303',
        'msg': {
          'keyValue': 'The authorization code did not match.'
        }
      }
    }
  }
};

export const domainWithTrademark = {
  'fullyQualifiedDomainName': 'trademark.domain',
  'claim': true
};

export const domainWithoutTrademark = {
  'fullyQualifiedDomainName': 'notrademark.domain',
  'claim': false
};

export const domainBadAllocationToken = {
  'fullyQualifiedDomainName': 'notokenforyou.domain',
  'avail': false,
  'reason': 'Invalid domain-token pair'
};

export const domainGoodAllocationToken = {
  'fullyQualifiedDomainName': 'tokenok.domain',
  'avail': true
};

export const createDomainResponseSuccess = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'The command completed successfully'
        }
      },
      resData: {
        'domain:creData': {
          'domain:id': {
            'keyValue': 'domain.domain'
          },
          'domain:crDate': {
            'keyValue': '2016-04-21T22:00:00.0Z'
          },
          'domain:exDate': {
            'keyValue': '2017-04-21T22:00:00.0Z'
          }
        },
      }
    }
  }
};

export const createDomainResponseError = {
  epp: {
    response: {
      result: {
        '@code': '2303',
        'msg': {
          'keyValue': 'The host with given ID (ns1.domain.domain) doesn\'t exist.'
        }
      },
      resData: {
        'domain:creData': {
          'domain:id': {
            'keyValue': 'domain.domain'
          },
          'domain:crDate': {
            'keyValue': '2016-04-21T22:00:00.0Z'
          }
        },
      }
    }
  }
};

export const deleteDomainResponseFailure = {
  epp: {
    response: {
      result: {
        '@code': '2030',
        'msg': {
          'keyValue': 'The domain with given ID (donuts_666) doesn\'t exist.'
        }
      }
    }
  }
};

export const deleteDomainResponseSuccess = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'Command completed successfully'
        }
      }
    }
  }
};

export const transferDomainResponseSuccess = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        msg: {
          'keyValue': 'Command completed successfully'
        }
      },
      resData: {
        'domain:trnData': {
          'domain:name': {
            'keyValue': 'transferme.wtf'
          },
          'domain:trStatus': {
            'keyValue': 'pending'
          },
          'domain:reID': {
            'keyValue': 'tldsrus'
          },
          'domain:reDate': {
            'keyValue': '2016-05-06T22:48:48Z'
          },
          'domain:acID': {
            'keyValue': 'brodaddy'
          },
          'domain:acDate': {
            'keyValue': '2016-05-06T22:48:48Z'
          },
          'domain:exDate': {
            'keyValue': '2018-05-06T22:48:48Z'
          }
        }
      }
    }
  }
};

export const transferDomainResponseNoTransferHistory = {
  epp: {
    response: {
      result: {
        '@code': '2002',
        msg: {
          'keyValue': 'Object has no transfer history'
        }
      }
    }
  }
};

export const transferDomainResponseTransferAlreadyPending = {
  epp: {
    response: {
      result: {
        '@code': '2300',
        msg: {
          'keyValue': 'Object with given ID (transferme.wtf) already has a pending transfer.'
        }
      }
    }
  }
};

export const transferDomainResponseNoAuthCode = {
  epp: {
    response: {
      result: {
        '@code': '2201',
        msg: {
          'keyValue': 'Authorization info is required to request a transfer'
        }
      }
    }
  }
};

export const transferDomainResponseAuthCodeNotValid = {
  epp: {
    response: {
      result: {
        '@code': '2202',
        msg: {
          'keyValue': 'Authorization information for accessing resource is invalid'
        }
      }
    }
  }
};

export const domainTransferActionItemInfo = {
  name: 'transferme.wtf',
  trStatus: 'pending',
  reID: 'tldsrus',
  reDate: '2016-08-16T22:03:12Z',
  acID: 'brodaddy',
  acDate: '2016-08-16T22:03:12Z',
  exDate: '2018-08-16T22:03:12Z',
  transferAction: 'cancel',
  authorizationCode: null
};

export const cancelDomainTransferResponseSuccess = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        msg: {
          'keyValue': 'Command completed successfully'
        }
      },
      resData: {
        'domain:trnData': {
          'domain:name': {
            'keyValue': 'transferme.wtf'
          },
          'domain:trStatus': {
            'keyValue': 'clientCancelled'
          },
          'domain:reID': {
            'keyValue': 'tldsrus'
          },
          'domain:reDate': {
            'keyValue': '2016-08-16T22:03:12Z'
          },
          'domain:acID': {
            'keyValue': 'brodaddy'
          },
          'domain:acDate': {
            'keyValue': '2016-08-16T22:03:12Z'
          }
        }
      }
    }
  }
};


export const renewDomainResponseSuccess = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        msg: {
          'keyValue': 'Command completed successfully'
        }
      },
      resData: {
        'domain:renData': {
          'domain:exDate': {
            'keyValue': '2018-05-06T22:48:48Z'
          }
        }
      }
    }
  }
};

export const renewDomainResponseError = {
  epp: {
    response: {
      result: {
        '@code': '2002',
        msg: {
          'keyValue': 'There was an error of some sort.'
        }
      }
    }
  }
};

export const restoreDomainResponseError = {
  epp: {
    response: {
      result: {
        '@code': '2304',
        msg: {
          'keyValue': 'Domain is not eligible for restore'
        }
      }
    }
  }
};

export const restoreDomainResponseSuccess = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'Command completed successfully'
        }
      },
      extension: {
        'rgp:upData': {
          'rgp:rgpStatus': {
            '@s': 'pendingRestore'
          }
        }
      }
    }
  }
};

export const restoreDomainResponseSuccessNoExtensionElement = {
  epp: {
    response: {
      result: {
        '@code': '1000',
        'msg': {
          'keyValue': 'Command completed successfully'
        }
      }
    }
  }
};

export const registrationPeriodValues = [
  { id: 1, text: 'year' },
  { id: 2, text: 'years' },
  { id: 3, text: 'years' },
  { id: 4, text: 'years' },
  { id: 5, text: 'years' },
  { id: 6, text: 'years' },
  { id: 7, text: 'years' },
  { id: 8, text: 'years' },
  { id: 9, text: 'years' },
  { id: 10, text: 'years' }
];

export const createPriceInfoForPremiumDomain = {
  create: {
    currency: 'USD',
    fee: {
      create: '999.00'
    },
    class: 'premium',
    period: '1',
    periodUnit: 'y'
  }
};

export const createPriceInfoForNonPremiumDomain = {
  create: {
    currency: 'USD',
    fee: {
      create: '8.00'
    },
    period: '1',
    periodUnit: 'y'
  }
};

export const renewPriceInfoForPremiumDomain = {
  renew: {
    currency: 'USD',
    fee: {
      renew: '999.00'
    },
    class: 'premium',
    period: '1',
    periodUnit: 'y'
  }
};

export const renewPriceInfoForNonPremiumDomain = {
  renew: {
    currency: 'USD',
    fee: {
      renew: '8.00'
    },
    period: '1',
    periodUnit: 'y'
  }
};
