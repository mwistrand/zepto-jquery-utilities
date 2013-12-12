(function($) {
'use strict';

window.u$ || (window.u$ = {});

var helpers = {
  // these decorate proto
  decorate: function decorate(method, name) {
    this._decorators || (this._decorators = {});
    if (!this._decorators[method]) this._decorators[method] = {};
    this._decorators[method][name] = true;

    return this;
  },

  undecorate: function undecorate(method, name) {
    var decorators = this._decorators && this._decorators[method];
    decorators && (decorators[name] = false);

    return this;
  },

  filter: function filter(decorators, callbacks) {
    return callbacks.filter(function(method) {
      var name = $.isPlainObject(method) ? method.name : method;

      return decorators && decorators[name] && method;
    });
  },

  reduce: function reduce(methods, initial) {
    return methods.reduce(function(memo, method) {
      var fn = $.isPlainObject(method) ? method.fn : this[method];

      return fn.call(this, memo);
    }.bind(this), initial);
  },

  getDecorator: function getDecorator(name, fn, callbacks) {
    return function() {
      var initial = fn.apply(this, arguments),
        decorators = this._decorators && this._decorators[name],
        methods;

      if (!decorators) {
        return initial;
      }

      // Include only the decorator methods that have been added
      methods = helpers.filter(decorators, callbacks);

      // Decorators are executed in the order they were passed in,
      // not the order they were added.
      return helpers.reduce.call(this, methods, initial);
    };
  },

  setDecorators: function setDecorators(decorators) {
    var key,
      original,
      callbacks;

    for (key in decorators) {
      if (decorators.hasOwnProperty(key)) {
        original = this[key];

        if ($.isFunction(original)) {
          callbacks = decorators[key];
          this[key] = helpers.getDecorator(key, original, callbacks);
        }
      }
    }

    return this;
  }
};

u$.decorate = function(proto, decorators) {
  if (!$.isPlainObject(decorators)) {
    throw new TypeError('decorators must be an object');
  }

  proto.decorate = helpers.decorate;
  proto.undecorate = helpers.undecorate;

  return helpers.setDecorators.call(proto, decorators);
};

})(window.Zepto || window.jQuery);