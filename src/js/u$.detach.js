(function($) {
'use strict';

window.u$ || (window.u$ = {});

u$.detach = function(obj, namespace, props) {
  $.isArray(props) || (props = [].slice.call(arguments, 2)),
    old = [];

  props.forEach(function(name) {
    var prop = obj[name];

    if (u$.isInstanceOf$(prop)) {
      prop.off('.' + namespace);
    }
    
    old.push(prop);
    obj[name] = null;
  });

  return old;
};

})(window.Zepto || window.jQuery);