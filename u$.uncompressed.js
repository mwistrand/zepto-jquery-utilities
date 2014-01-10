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

/**
 * Creates a new object from a prototype, passes the instance object
 * to an optional callback, calls an `initialize` method, passing to it
 * the remaining arguments.
 *
 * @param proto The object to pass to `Object.create`.
 * @param beforeFn An optional callback function that will be passed
 *                 the newly-created instance object.
 * @param *arguments* Additional arguments will be passed to the instance
 *                    object's `initialize` function, if it exists.
 *
 * @returns The instance object.
 */
u$.create = function(proto, beforeFn) {
  var instance = Object.create(proto),
    args = [].slice.call(arguments, 2);

  if ($.isFunction(beforeFn)) {
    beforeFn(instance);
  }

  if ($.isFunction(instance.initialize)) {
    instance.initialize.apply(instance, args);
  }

  return instance;
};

})(window.Zepto || window.jQuery);
(function($) {
'use strict';

window.u$ || (window.u$ = {});

function throwIfNotString(name, item) {
  if (typeof item !== 'string') {
    throw new TypeError(name + ' expects a string.');
  }
}

/**
 * Removes the hash from the end of a URL.
 *
 * @param url The URL to test
 * @throws TypeError if not provided a string.
 * @returns The modified string.
 */
u$.stripHash = function(url) {
  throwIfNotString('u$.stripHash', url);

  return (url.indexOf('#') !== -1) ? url.split('#')[0] : url;
};

/**
 * Returns a URL's query string without the hash at the end.
 *
 * @param url The URL to test.
 * @throws TypeError if not provided a string.
 * @returns The modified string.
 */
u$.getQuery = function(url) {
  var query;

  throwIfNotString('u$.getQuery', url);

  query = url.split('?');
  query = query && query[1] || '';

  return u$.stripHash(query);
};

/**
 * Converts a query string to an object of param names and values.
 *
 * USAGE:
 * u$.getObjectFromQuery('http://example.com/?a=1&b=2#3');
 * // returns {a : '1', b: '2'}
 *
 * @param The URL to convert.
 * @throws TypeError if not provided a string.
 * @returns An object containing the query string parameters in
 *          key/value pairs.
 */
u$.getObjectFromQuery = function(url) {
  var query;

  throwIfNotString('u$.getObjectFromQuery', url);

  query = u$.getQuery(url);

  if (!query) {
    return null;
  } else {
    query = query.split('&');

    return query.reduce(function(memo, param) {
      var parts = param.split('=');

      memo[parts[0].toLowerCase()] = parts[1];

      return memo;
    }, {});
  }
};

})(window.Zepto || window.jQuery);
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
(function($) {
'use strict';

window.u$ || (window.u$ = {});

/**
 * Helper method for detaching namespaced events and cleaning
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
(function($) {
'use strict';

window.u$ || (window.u$ = {});

// Provides basic template rendering capabilities.
// 
// Usage:
//   `var template = '<div data-id="{{id}}">{{title}}</div>',
//     data = [{'id': 12345, 'title': 'Lorem ipsum dolor sit amet'}];
//   render(template, data, $('#container'));
//
var render = (function() {
  var pattern = /\{\{([A-Za-z0-9\-_]+)\}\}/gi;

  function setHTML($container, item, template) {
    var html = template.replace(pattern, function(matched, key) {
      var replacement = item[key];

      return replacement || '';
    });

    if (html.length) {
      $(html).appendTo($container);
    }
  }

  return function($container, data, template) {
    $container.html('');

    if ($.isArray(data)) {
      data.forEach(function(item) {
        setHTML($container, item, template);
      });
    } else {
      setHTML($container, data, template);
    }
  };
})();

/**
 * Converts JSON to HTML based on the provided template, and replaces
 * the provided element's HTML with the result.
 *
 * @param $el The `$` element where the generated HTML will be inserted.
 * @param json The JSON string.
 * @param template Either a string (see private `render` function above)
 *                 or a function that is passed the element and object.
 */
u$.renderJSON = function($el, json, template) {
  var obj = $.parseJSON(json);

  if ($.isFunction(template)) {
    template($el, obj);
  } else {
    render($el, obj, template);
  }
};

/**
 * Creates a new element from provided data and injects it into a parent.
 *
 * @param parent The parent element to which the new element will be added.
 * @param data Either an HTML string or an array of data to pass to `$`.
 * @param prepend If true, the new element will be added as the first
 *                child of the parent. Otherwise, it will added as the last.
 */
u$.render = function(parent, data, prepend) {
  var $elem = $.isArray(data) ? $.apply($, data) : $(data),
    method = prepend ? 'prependTo' : 'appendTo';

  if (parent) {
    $elem[method](parent);
  }

  return $elem;
};

})(window.Zepto || window.jQuery);
/**
 * A mixin to set up cache management. Provides two methods:
 * `setCache` and `getCache`. Note that the parent should have
 * an `options` object with a boolean `cache` value.
 *
 * Caching can be turned on/off via the parent object's `options.cache`
 * property.
 */
(function($) {
'use strict';

window.u$ || (window.u$ = {});

u$.cacheMixin = {
  /* options: {
    cache: true
  },*/


  /**
   * Adds an item to the cache. If the parent object's
   * `this.options.cache` is `true`, then the cache will be updated.
   *
   * @param key The reference key
   * @param data The data to cache
   *
   * @returns `this`
   */
  setCache: function(key, data) {
    var options = this.options;

    if (options && options.cache) {
      this._cache || (this._cache = {});
      this._cache[key] = data;
    }

    return this;
  },

  /**
   * Fetches an item from the cache. If the item does not
   * exists, then `undefined` is returned.
   *
   * @param key The reference key
   *
   * @returns The data or `undefined` if not found.
   */
  getCache: function(key) {
    return this._cache && this._cache[key];
  }
};

})(window.Zepto || window.jQuery);
/**
 * Mixin for displaying an AJAX loader/spinner. Objects implement this will
 * be decorated with `showLoader` and `hideLoader` methods.
 *
 * A CSS class can be added to the loader element by specifying a
 * `loaderClass` option on the parent object's `options` object.
 *
 * The HTML for the loader element can be specified via a `loaderHTML`
 * string option on the parent object's `options` object.
 *
   ```
   var proto = {
     beforeShow: function() {
       this.showLoader(callbackFn, $element)
     }
   };
   $.extend(proto, u$.loaderMixin);
   ```
 *
 */
(function($) {
'use strict';

window.u$ || (window.u$ = {});

u$.loaderMixin = {
  //options: {
  //  loaderClass: 'loader--modifier',
  //  loaderHTML: '<div />'
  //},
  
  /**
   * Displays an AJAX loader. If the element does not yet exist,
   * it will be created.
   *
   * @param $appendTo The `$` element to which the loader will be injected.
   *        Defaults to `document.body`.
   * @param beforeShow A callback to execute before the loader is shown.
   *        This is useful for adding other elements such as a darkened
   *        overlay.
   *
   * @returns `this`
   */
  showLoader: function($appendTo, beforeShow) {
    var options = this.options,
      appendTo = $appendTo && $appendTo.length ? $appendTo : document.body;

    if ($.isFunction(beforeShow)) {
      beforeShow.call(this);
    }

    this.$loader = $((options && options.loaderHTML) || '<div />').
        addClass('loader').appendTo(appendTo);

    if (options && options.loaderClass) {
      this.$loader.addClass(options.loaderClass);
    }

    return this;
  },

  /**
   * Hides the AJAX loader, if it exists. The element will be removed
   * from the DOM.
   *
   * @returns `this`
   */
  hideLoader: function() {
    if (this.$loader) {
      this.$loader.remove();
      this.$loader = null;
    }

    return this;
  }
};

})(window.Zepto || window.jQuery);