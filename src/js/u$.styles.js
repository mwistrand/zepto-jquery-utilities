(function($) {
'use strict';

window.u$ || (window.u$ = {});

var unhideProps = {
  display: 'block',
  position: 'absolute',
  visibility: 'hidden'
};

/**
 * Takes an object of styles and returns an object containing
 * an element's current styles.
 *
 * @param $el The Zepto/jQuery element
 * @param props An object of styles
 * @param callback An optional function that will be executed for each
 *                 style in the `props` object.
 *
 * @returns An object containing the element's styles.
 */
u$.getStyles = function($el, props, callback) {
  var old = {};
  
  $.each(props, function(name, value) {
    old[name] = $el.css(name);
    
    if ($.isFunction(callback)) {
      callback($el, name, value);
    }
  });
  
  return old;
};

/**
 * Sets styles on an element and returns an object containing the old styles.
 *
 * @param $el The `$` element object.
 * @param props An object containing the style names (keys) and values.
 *
 * @returns An object containing the old styles.
 */
u$.mapStyles = (function() {
  function setStyle($el, name, value) {
    $el.css(name, value);
  }
  
  return function($el, props) {
    return u$.getStyles($el, props, setStyle);
  };
})();

/**
 * Maps styles to an element, executes a callback, and then
 * resets the old styles.
 *
 * @param $el The `$` element
 * @param props The styles to add to the element
 * @param fn The callback to execute after the styles are mapped
 *           and before the old styles are reset.
 *
 * @returns The return value of the callback.
 */
u$.resetMappedStyles = function($el, props, fn) {
  var old = u$.mapStyles($el, props),
    retValue = fn($el);
  
  $.each(old, function(name, value) {
    $el.css(name, value);
  });
  
  return retValue;
};

/**
 * Gets the full height of the passed-in element.
 *
 * @param $el The `$` element
 *
 * @returns The height in pixels.
 */
u$.height = (function() {
  var props = $.extend(Object.create(unhideProps), {
    borderTop: 0,
    borderBottom: 0,
    paddingTop: 0,
    paddingBottom: 0
  });
  
  return function($el) {
    return u$.resetMappedStyles($el, props, function($el) {
      return $el.get(0).offsetHeight;
    });
  };
})();

})(window.Zepto || window.jQuery);