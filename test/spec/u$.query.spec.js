describe('u$ Query String Handling', function() {
  'use strict';

  it('strips the hash from a URL', function() {
    expect(u$.stripHash('http://example.com?')).toEqual('http://example.com?');
    expect(u$.stripHash('')).toEqual('');
    expect(function() {
      u$.stripHash(12345);
    }).toThrow();
    expect(u$.stripHash('http://example.com?a=1&b=2#3')).
        toEqual('http://example.com?a=1&b=2');
  });

  it('strips the query string from a URL', function() {
    expect(u$.getQuery('http://example.com?')).toEqual('');
    expect(u$.getQuery('')).toEqual('');
    expect(function() {
      u$.getQuery(12345);
    }).toThrow();
    expect(u$.getQuery('http://example.com?a=1&b=2#3')).toEqual('a=1&b=2');
  });

  it('returns an object containing query string parameters', function() {
    var obj = u$.getObjectFromQuery('http://example.com?a=1&b=2#3');
    expect(u$.getObjectFromQuery('http://example.com?')).toEqual(null);
    expect(u$.getObjectFromQuery('')).toEqual(null);
    expect(function() {
      u$.getObjectFromQuery(12345);
    }).toThrow();
    expect(obj.a).toEqual('1');
    expect(obj.b).toEqual('2');
  });
});