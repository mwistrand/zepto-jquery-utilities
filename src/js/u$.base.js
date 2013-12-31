(function($) {
'use strict';

window.u$ || (window.u$ = {});

/**
 * Attempts to return a parsed integer from the passed-in value.
 * If the result is not a number, then `null` is returned.
 *
 * @param item The object to parse
 *
 * @return The integer, or null if not a valid number.
 */
u$.toInt = function(item) {
  var int = parseInt(item, 10);
  return isNaN(int) ? null : int;
};

/**
 * Checks if the passed-in object is an instance of `$`.
 *
 * @param obj The object to check
 *
 * @returns Boolean `true` if the object is an instance of `$`.
 *          Otherwise, `false`.
 */
u$.is$ = function(obj) {
  return (window.Zepto) ? $.zepto.isZ(obj) : (obj instanceof $);
};

/**
 * Creates a new object from a prototype, passes the instance object
 * to an optional callback, calls an `initialize` method, passing to it
 * the remaining arguments.
 *
 * @param proto The object to pass to `Object.create`.
 * @param beforeFn An optional callback function that will be passed
 *                 the newly-created instance object.
 * @param *arguments* Additional arguments will be passed to the instance
 *                    object's `initialize` function, if it exists.
 *
 * @returns The instance object.
 */
u$.create = function(proto, beforeFn) {
  var instance = Object.create(proto),
    args = [].slice.call(arguments, 2);

  if ($.isFunction(beforeFn)) {
    beforeFn(instance);
  }

  if ($.isFunction(instance.initialize)) {
    instance.initialize.apply(instance, args);
  }

  return instance;
};

})(window.Zepto || window.jQuery);