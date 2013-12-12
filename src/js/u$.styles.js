(function($) {
'use strict';

window.u$ || (window.u$ = {});

var unhideProps = {
  display: 'block',
  position: 'absolute',
  visibility: 'hidden'
};

u$.getNumericStyles = (function() {
  var directions = 'top,right,bottom,left'.split(',');
  
  function testStyle(style) {
    return !isNaN(parseInt(style, 10));
  }
  
  function setStyle($el, name, styles) {
    var style = $el.css(name);
    
    if (testStyle(style)) {
      styles[name] = style;
    }
    
    return style;
  }
  
  return function($el, styles) {
    var props = [].slice.call(arguments, 2);
    
    $.each(props, function(i, name) {
      var style = $el.css(name + '-top');

      if (style !== null) {
        $.each(directions, function(i, dir) {
          setStyle($el, name + '-' + dir, styles);
        });
      } else {
        setStyle($el, name, styles);
      }
    });
    
    return styles;
  };
})();

u$.getStyles = function($el, props, callback) {
  var old = {};
  
  $.each(props, function(name, value) {
    old[name] = $el.css(name);
    
    if (callback) {
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
    paddingTop: 0,
    paddingBottom: 0,
    borderTop: 0,
    borderBottom: 0
  });
  
  return function($el) {
    return u$.resetMappedStyles($el, props, function($el) {
      return $el.get(0).offsetHeight;
    });
  };
})();

})(window.Zepto || window.jQuery);