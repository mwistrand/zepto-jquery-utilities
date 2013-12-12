(function($) {
'use strict';

window.u$ || (window.u$ = {});

/**
 * Helper method for detaching namespace events and cleaning
 * references to object properties.
 *
 * @param obj The object to clean
 * @param namespace The namespace string (without preceding period)
 * @param props An array of property names to detach/null
 *
 * @returns An array of the old properties. Returning an array makes it
 *          easy to apply the return value to another function.
 */
u$.detach = function(obj, namespace, props) {
  var old = [];

  $.isArray(props) || (props = [].slice.call(arguments, 2));

  props.forEach(function(name) {
    var prop = obj[name];

    if (u$.is$(prop)) {
      prop.off('.' + namespace);
    }
    
    old.push(prop);
    obj[name] = null;
  });

  return old;
};

})(window.Zepto || window.jQuery);