(function($) {
'use strict';

window.u$ || (window.u$ = {});

var helpers = {
  
  /**
   * Added as a method to the object passed to `u$.decorate`
   * Adds a decorator to a method's decorator chain.
   *
   * @param method The name of the method to decorate.
   * @param method The name of the decorator.
   *
   * @returns `this`
   */
  decorate: function decorate(method, name) {
    this._decorators || (this._decorators = {});
    if (!this._decorators[method]) this._decorators[method] = {};
    this._decorators[method][name] = true;

    return this;
  },

  /**
   * Added as a method to the object passed to `u$.decorate`
   * Removes a decorator from a method's decorator chain.
   *
   * @param method The name of the method to modify.
   * @param name The name of the decorator.
   *
   * @returns `this`
   */
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

/**
 * Provides implementation for the decorator pattern.
 * Adds `decorate` and `undecorate` methods to the passed-in object.
 *
 * USAGE
   ```
   var proto = u$.decorate({
      getPrice: function() {
        this.price || (this.price = 10);
        return this.toCurrency(this.price);
      },

      toCurrency: function(unit) {
        return Number(unit.toFixed(2));
      },

      addFedTax: function(price) {
        return this.toCurrency(price * 1.04);
      },

      addStateTax: function(price) {
        return this.toCurrency(price * 1.08);
      }
    }, {
      getPrice: ['addFedTax', 'addStateTax', {
        name: 'addLocalTax',
        fn: function(price) {
          return this.toCurrency(price * 1.02);
        }
      }]
    });

  var instance = Object.create(proto);
  instance.decorate('getPrice', 'addLocalTax');
  instance.getPrice(); // 10.20
  ```
 *
 * @param proto The object to modify.
 * @param decorators An object of method names containing the details of
 *                   which methods can be used to decorate them. The key
 *                   must be the name of a method on `proto`, and the value
 *                   must be an array of methods. These methods can either
 *                   be a string representing the name of a method on `proto`,
 *                   or an object with a "name" (string) and "fn" (function)
 *                   values.
 *
 * @returns The modified prototype object.
 */
u$.decorate = function(proto, decorators) {
  if (!$.isPlainObject(decorators)) {
    throw new TypeError('decorators must be an object');
  }

  proto.decorate = helpers.decorate;
  proto.undecorate = helpers.undecorate;

  return helpers.setDecorators.call(proto, decorators);
};

})(window.Zepto || window.jQuery);