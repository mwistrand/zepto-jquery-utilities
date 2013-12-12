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

function slideDown($el, height, options) {
  var props = !$el.get(0).offsetHeight ? boxStyles : {},
    toHeight = height || u$.height($el),
    css = getOverflow($el),
    toAnimate = u$.mapStyles($el, props);

  toAnimate.height = toHeight;
  u$.mapStyles($el, initial);
  $el.css(css).animate(toAnimate, options);
}

u$.slideUp = function($el, height, options) {
  height = u$.toInt(height) ? height : 0;

  slideUp($el, height, options);
};

u$.slideDown = function($el, height, options) {
  height = u$.toInt(height) ? height : 0;

  slideDown($el, height, options);
};

if (!$.fn.slideUp) {
  $.fn.slideUp = function(options) {
    if (!$.isPlainObject(options)) {
      options = setOptions.apply(null, arguments);
    }

    slideUp(this, 0, options);
  };
}

if (!$.fn.slideDown) {
  $.fn.slideDown = function(options) {
    if (!$.isPlainObject(options)) {
      options = setOptions.apply(null, arguments);
    }

    slideDown(this, 0, options);
  };
}

})(window.Zepto || window.jQuery);