/**
 * Provides functionality for sliding up or down DOM elements. The following
 * methods are included:
 * `u$.slideUp`
 * `u$.slideDown`
 * `$.fn.slideUp` for Zepto
 * `$.fn.slideDown` for Zepto
 */
(function($) {
'use strict';

window.u$ || (window.u$ = {});

var toZero = {
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0
  },
  boxStyles = $.extend(Object.create(toZero), {
    height: 0
  }),
  initial = {
    display: 'block',
    height: 0,
    overflow: 'hidden'
  };

// jQuery's `$.fn.slideUp` and `$.fn.slideDown` can take either an
// object of options, or certain options can be provided directly
// as arguments. This function converts an arguments list to an object.
function setOptions() {
  var options = {
    duration: arguments[0]
  };

  if ($.isFunction(arguments[1])) {
    options.complete = arguments[1];
  } else {
    options.easing = arguments[1];
    options.complete = arguments[2];
  }

  return options;
}

// Decorates an options object's `complete` method with a method
// that will be called before the original function.
function extendOpts($el, options, fn) {
  var complete = options && options.complete;

  return $.extend((options || {}), {
    complete: function() {
      fn.call($el);

      if ($.isFunction(complete)) {
        complete.call($el);
      }
    }
  });
}

// Returns an object containing an element's `overflowX` and `overflowY`.
// properties. Unless the element's `overflowY` value is `scroll`, the
// `overflowY` value of the returned object will always be `hidden`.
function getOverflow($el) {
  var css = {
    overflowY: $el.css('overflow-y'),
    overflowX: $el.css('overflow-x')
  };

  if (css.overflowY !== 'scroll') {
    css.overflowY = 'hidden';
  }

  return css;
}

// Slides the element up to a specified height, or to 0. If a height
// is specified, then only the `height` is animated. Otherwise, the
// `height`, `padding-top`, `padding-bottom`, `margin-top`, and
// `margin-bottom` values are animated.
function slideUp($el, height, options) {
  var props = !height ? boxStyles : { height: height },
    old = u$.getStyles($el, props),
    opts = extendOpts($el, options, function() {
      if (!height) {
        $(this).css('display', 'none').css(old);
      }
    }),
    css = getOverflow($el);

  css.height = u$.height($el);
  $el.css(css).animate(props, opts);
}

// Slides the element down to a specified height, or to its full height.
// If at least a portion of the element is currently visible, then only
// the `height` will be animated. Otherwise, the `height`, `padding-top`,
// `padding-bottom`, `margin-top`, and `margin-bottom` values are animated.
function slideDown($el, height, options) {
  var props = !$el.get(0).offsetHeight ? boxStyles : {},
    toHeight = height || u$.height($el),
    css = getOverflow($el),
    toAnimate = u$.mapStyles($el, props);

  toAnimate.height = toHeight;
  u$.mapStyles($el, initial);
  $el.css(css).animate(toAnimate, options);
}

/**
 * Slides an element up to a specified height, or 0.
 *
 * @param $el The `$` element to animate
 * @param height The optional height for the animation. Defaults to 0.
 * @param options An object of options controlling the animation. These
 *                are identical to the options for jQuery's `$.fn.slideUp.`
 */
u$.slideUp = function($el, height, options) {
  height = u$.toInt(height) ? height : 0;

  slideUp($el, height, options);
};

/**
 * Slides an element down to a specified height, or to its full height.
 *
 * @param $el The `$` element to animate
 * @param height The optional height for the animation. Defaults to the
 *               element's full height.
 * @param options An object of options controlling the animation. These
 *                are identical to the options for jQuery's `$.fn.slideDown.`
 */
u$.slideDown = function($el, height, options) {
  height = u$.toInt(height) ? height : 0;

  slideDown($el, height, options);
};

if (!$.fn.slideUp) {
  /**
   * This is included for Zepto, and is identical to the jQuery equivalent.
   */
  $.fn.slideUp = function(options) {
    if (!$.isPlainObject(options)) {
      options = setOptions.apply(null, arguments);
    }

    slideUp(this, 0, options);

    return this;
  };
}

if (!$.fn.slideDown) {
  /**
   * This is included for Zepto, and is identical to the jQuery equivalent.
   */
  $.fn.slideDown = function(options) {
    if (!$.isPlainObject(options)) {
      options = setOptions.apply(null, arguments);
    }

    slideDown(this, 0, options);

    return this;
  };
}

})(window.Zepto || window.jQuery);