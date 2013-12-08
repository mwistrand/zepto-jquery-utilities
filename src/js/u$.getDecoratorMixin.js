(function($) {
'use strict';

window.u$ || (window.u$ = {});

u$.decoratorMixin = function(names) {
  $.isArray(names) || (names = [].slice.call(arguments));

  return {
    decorate: function(name) {
      this._decorators || (this._decorators = {});
      this._decorators[name] = true;
      return this;
    },

    undecorate: function(name) {
      this._decorators[name] = false;
      return this;
    },

    reduceDecorators: function(value) {
      var methods;

      if (!this._decorators) {
        return value;
      }
      
      // Include only the decorator methods that have been added
      methods = names.filter(function(method) {
        return this._decorators[method] && method;
      }.bind(this));
      
      // Decorators are executed in the order they were passed in,
      // not the order they were added.
      return methods.reduce(function(memo, method) {
        return this[method](memo);
      }.bind(this), value);
    }
  };
};

})(window.Zepto || window.jQuery)