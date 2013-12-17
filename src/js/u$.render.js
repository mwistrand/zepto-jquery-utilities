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