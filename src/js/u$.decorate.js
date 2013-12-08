(function($) {
'use strict';

window.u$ || (window.u$ = {});

// these decorate proto
function decorate(method, name) {
  this._decorators || (this._decorators = {});
  if (!this._decorators[method]) this._decorators[method] = {};
  this._decorators[method][name] = true;

  return this;
}

function undecorate(method, name) {
  var decorators = this._decorators && this._decorators[method];
  decorators && (decorators[name] = false);

  return this;
}

function filter(decorators, callbacks) {
  return callbacks.filter(function(method) {
    var name = $.isPlainObject(method) ? method['name'] : method;

    return decorators && decorators[name] && method;
  });
}

function reduce(methods, initial) {
  return methods.reduce(function(memo, method) {
    var fn = $.isPlainObject(method) ? method.fn : this[method];

    return fn.call(this, memo);
  }.bind(this), initial);
}

function getDecorator(name, fn, callbacks) {
  return function() {
    var initial = fn.apply(this, arguments),
      decorators = this._decorators && this._decorators[name],
      methods;

    if (!decorators) {
      return initial;
    }

    // Include only the decorator methods that have been added
    methods = filter(decorators, callbacks);

    // Decorators are executed in the order they were passed in,
    // not the order they were added.
    return reduce.call(this, methods, initial);
  };
}

function setDecorators(decorators) {
  var key,
    original,
    callbacks;

  for (key in decorators) {
    if (decorators.hasOwnProperty(key)) {
      original = this[key];

      if ($.isFunction(original)) {
        callbacks = decorators[key];
        this[key] = getDecorator(key, original, callbacks);
      }
    }
  }

  return this;
}

u$.decorate = function(proto, decorators) {
  if (!$.isPlainObject(decorators)) {
    throw new TypeError('decorators must be an object');
  }

  proto.decorate = decorate;
  proto.undecorate = undecorate;

  return setDecorators.call(proto, decorators);
};

})(window.Zepto || window.jQuery)