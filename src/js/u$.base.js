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

})(window.Zepto || window.jQuery);