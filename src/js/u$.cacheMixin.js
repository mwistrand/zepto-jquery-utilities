(function($) {
'use strict';

window.u$ || (window.u$ = {});

u$.cacheMixin = {
  setCache: function(key, data) {
    if (this.options.cache) {
      this._cache || (this._cache = {});
      this._cache[key] = data;
    }
  },

  getCache: function(key) {
    return this._cache && this._cache[key] || null;
  }
};

})(window.Zepto || window.jQuery);