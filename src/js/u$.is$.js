(function($) {
'use strict';

window.u$ || (window.u$ = {});

u$.is$ = function(obj) {
  return (window.Zepto) ? $.zepto.isZ(obj) : (obj instanceof $);
};

})(window.Zepto || window.jQuery);