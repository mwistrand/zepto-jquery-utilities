(function($) {
'use strict';

window.u$ || (window.u$ = {});

/**
 * Determines whether an object is an instance of `$`.
 *
 * @param obj The object to test.
 *
 * @returns Boolean true if the test passed or false.
 */
u$.is$ = function(obj) {
  return (window.Zepto) ? $.zepto.isZ(obj) : (obj instanceof $);
};

})(window.Zepto || window.jQuery);