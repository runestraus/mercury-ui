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
});
