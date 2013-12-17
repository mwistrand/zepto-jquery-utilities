/**
 * A mixin to set up cache management. Provides two methods:
 * `setCache` and `getCache`. Note that the parent should have
 * an `options` object with a boolean `cache` value.
 *
 * Caching can be turned on/off via the parent object's `options.cache`
 * property.
 */
(function($) {
'use strict';

window.u$ || (window.u$ = {});

u$.cacheMixin = {
  /* options: {
    cache: true
  },*/


  /**
   * Adds an item to the cache. If the parent object's
   * `this.options.cache` is `true`, then the cache will be updated.
   *
   * @param key The reference key
   * @param data The data to cache
   *
   * @returns `this`
   */
  setCache: function(key, data) {
    var options = this.options;

    if (options && options.cache) {
      this._cache || (this._cache = {});
      this._cache[key] = data;
    }

    return this;
  },

  /**
   * Fetches an item from the cache. If the item does not
   * exists, then `undefined` is returned.
   *
   * @param key The reference key
   *
   * @returns The data or `undefined` if not found.
   */
  getCache: function(key) {
    return this._cache && this._cache[key];
  }
};

})(window.Zepto || window.jQuery);