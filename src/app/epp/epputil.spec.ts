import * as epputil from './epputil';

describe('EPP utility functions', () => {

  it('should extract extension attributes', () => {
    const data = {
      'foo:bar': {
        '@x': '12345'
      }
    };
    expect(epputil.extractExtension(data, 'foo:bar')).toBe('12345');
    expect(epputil.extractExtension(data, 'foo:bazz')).toBe('');
  });

  it('should extract text content', () => {
    const data = {
      'foo:bar': {
        'keyValue': '12345'
      }
    };
    expect(epputil.extractText(data, 'foo:bar')).toBe('12345');
    expect(epputil.extractText(data, 'foo:bazz')).toBe('');
  });

  it('should extract multiple statuses', () => {
    const data = {
      'foo:bar': [
        {
          '@s': 'foo',
        },
        {
          '@s': 'bar',
        }
      ]
    };
    expect(epputil.extractStatuses(data, 'foo:bar')).toEqual(['foo', 'bar']);
    expect(epputil.extractStatuses(data, 'foo:bazz')).toEqual([]);
  });

  it('should extract single status', () => {
    const data = {
      'foo:bar': {
        '@s': 'foo',
      }
    };
    expect(epputil.extractStatuses(data, 'foo:bar')).toEqual(['foo']);
    expect(epputil.extractStatuses(data, 'foo:bazz')).toEqual([]);
  });

  it('should extract type attribute', () => {
    const data = {
      'foo:bar': {
        '@type': 'foobar'
      }
    };
    expect(epputil.extractType(data, 'foo:bar')).toBe('foobar');
    expect(epputil.extractType(data, 'foo:bazz')).toBe('');
  });

  it('should extract a key/value map of type to keyValue', () => {
    const data = {
      'domain:contact': [
        {
          '@type': 'admin',
          'keyValue': 'donuts_300'
        },
        {
          '@type': 'tech',
          'keyValue': 'donuts_300'
        },
      ]
    };
    expect(epputil.extractTypes(data, 'domain:contact')).toEqual({
      'admin': 'donuts_300',
      'tech': 'donuts_300',
    });
  });

  it('should extract an empty key/value map of type to keyValue for nonexistent paths', () => {
    const data = {};
    expect(epputil.extractTypes(data, 'domain:contact')).toEqual({});
  });

  it('should return an array of length two with correct values from double nested object', () => {
    const data = {
      'domain:subordinateHosts': {
        'domain:subordinateHosts': [
          {
            'keyValue': 'donuts_300.cow'
          },
          {
            'keyValue': 'donuts_300.tld'
          },
        ]
      }
    };
    expect(epputil.extractArray(data, 'domain:subordinateHosts', 'domain:subordinateHosts')).toEqual(['donuts_300.cow', 'donuts_300.tld']);
  });

  it('should return an array of length two with correct values', () => {
    const data = {
      'domain:subordinateHosts': [
        {
          'keyValue': 'donuts_300.cow'
        },
        {
          'keyValue': 'donuts_300.tld'
        },
      ]
    };
    expect(epputil.extractArray(data, 'domain:subordinateHosts')).toEqual(['donuts_300.cow', 'donuts_300.tld']);
  });

  it('should return an array of length one with correct values', () => {
    const data = {
      'domain:subordinateHosts':
        {
          'keyValue': 'donuts_300.cow'
        },
    };
    expect(epputil.extractArray(data, 'domain:subordinateHosts')).toEqual(['donuts_300.cow']);
  });

  it('should return an array of length zero -- data is empty object', () => {
    const data = {};
    expect(epputil.extractArray(data, 'domain:subordinateHosts')).toEqual([]);
  });

  it('should return an array of length zero -- data has empty list', () => {
    const data = {
      'domain:subordinateHosts': [],
    };
    expect(epputil.extractArray(data, 'domain:subordinateHosts')).toEqual([]);
  });
});
