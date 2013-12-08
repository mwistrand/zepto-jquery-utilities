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

u$.renderJSON = function($el, json, template) {
  var obj = $.parseJSON(json);

  if ($.isFunction(template)) {
    template($el, obj);
  } else {
    render($el, obj, template);
  }
};

u$.render = function(data, parent, prepend) {
    var $elem = $.isArray(data) ? $.apply($, data) : $(data),
      method = prepend ? 'prependTo' : 'appendTo';

    if (parent) {
      $elem[method](parent);
    }

    return $elem;
  }

})(window.Zepto || window.jQuery);