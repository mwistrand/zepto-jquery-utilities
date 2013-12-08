(function($) {
'use strict';

window.u$ || (window.u$ = {});

u$.instanceOf$ = function(obj) {
  return (window.Zepto) ? $.zepto.isZ(obj) : (obj instanceof $);
};

})(window.Zepto || window.jQuery);