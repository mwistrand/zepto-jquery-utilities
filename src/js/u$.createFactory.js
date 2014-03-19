/**
 * Returns a factory function that:
 * 1. Creates a new instance object from a prototype.
 * 2. Calls an optional function bound to `this` before it...
 * 3. Calls an optional `initialize` method.
 *
 * Usage:
 * var protoObject = { initialize: function() {} };
 * var factory = u$.createFactory(protoObject, beforeFn);
 */
(function(global) {
'use strict';

global.u$ || (global.u$ = {});

u$.createFactory = function(proto, before) {
  return function() {
    var instance;

    if ($.isFunction(proto)) {
      proto = proto.apply(null, arguments);
    }

    instance = Object.create(proto);

    if (before) {
      before.apply(instance, arguments);
    }

    if (instance.initialize) {
      instance.initialize.apply(instance, arguments);
    }

    return instance;
  };
};

})(window);