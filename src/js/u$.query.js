(function($) {
'use strict';

window.u$ || (window.u$ = {});

function throwIfNotString(name, item) {
  if (typeof item !== 'string') {
    throw new TypeError(name + ' expects a string.');
  }
}

/**
 * Removes the hash from the end of a URL.
 *
 * @param url The URL to test
 * @throws TypeError if not provided a string.
 * @returns The modified string.
 */
u$.stripHash = function(url) {
  throwIfNotString('u$.stripHash', url);

  return (url.indexOf('#') !== -1) ? url.split('#')[0] : url;
};

/**
 * Returns a URL's query string without the hash at the end.
 *
 * @param url The URL to test.
 * @throws TypeError if not provided a string.
 * @returns The modified string.
 */
u$.getQuery = function(url) {
  var query;

  throwIfNotString('u$.getQuery', url);

  query = url.split('?');
  query = query && query[1] || '';

  return u$.stripHash(query);
};

/**
 * Converts a query string to an object of param names and values.
 *
 * USAGE:
 * u$.getObjectFromQuery('http://example.com/?a=1&b=2#3');
 * // returns {a : '1', b: '2'}
 *
 * @param The URL to convert.
 * @throws TypeError if not provided a string.
 * @returns An object containing the query string parameters in
 *          key/value pairs.
 */
u$.getObjectFromQuery = function(url) {
  var query;

  throwIfNotString('u$.getObjectFromQuery', url);

  query = u$.getQuery(url);

  if (!query) {
    return null;
  } else {
    query = query.split('&');

    return query.reduce(function(memo, param) {
      var parts = param.split('=');

      memo[parts[0].toLowerCase()] = parts[1];

      return memo;
    }, {});
  }
};

})(window.Zepto || window.jQuery);