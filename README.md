# `u$` Helper Library for Zepto/jQuery
`u$` is a library of helper functions and mixins that I frequently use in development. All functions below are methods of the global `u$` object.

## Dependencies
The ECMAScript 5 `Object.create` and `Array.prototype` methods. A lightweight fallback can be found on [GitHub](https://github.com/mwistrand/Light-ECMAScript5-Shim), and is also included in the /lib/ folder.

- `toInt(number)`=> integer
  * Converts an object to an integer (via `parseInt(num, 10)`). If the results is not a number, `null` will be returned.

- `is$(object)`=> boolean
  * Determines whether the passed-in object is an instance of Zepto or jQuery (`$`).

- `create(proto, beforeFn[, arg1[, arg2[, argN…]]])` => instance object
  * Creates a new object from a prototype, passes the instance object to an optional callback, calls an optional `initialize` method, passing to it the remaining arguments. E.g.,

```javascript
u$.create({
  initialize: function(author) {
    this.author = author;
  }
}, function(instance) {
  instance.UID = new Date().getTime();
}, 'J.R.R. Tolkien');
```

- `stripHash(string)`=> string
  * Removes the hash from the end of a URL. Throws `TypeError` if a string is not provided. E.g.,
`u$.stripHash('http://example.com#hash') // 'http://example.com'`

- `getQuery(string)` => string
  * Returns the query string, sans hash, from a URL. Throws `TypeError` if a  string is not provided. E.g.,
`u$.getQuery('http://example.com?a=1&b=2#3') // 'a=1&b=2'`

- `getObjectFromQuery` => object
  * Returns an object of a query string parameters from a URL. Throws `TypeError` if not provided a string. E.g.,
`u$.getQuery('http://example.com?a=1&b=2#3') // {a: 1, b: 2}`

- `getStyles($element, styles, callback)` => object
  * Returns an object containing an element styles. If an optional callback is provided, that callback will be passed the element, style name, and style value for each style in the `styles` object. E.g.,

```javascript
$el.css({opacity: 1, height: '100px'});
u$.getStyles($el, {opacity: 0, height: 0}); // {opacity: 1, height: '100px'}
```

- `mapStyles($element, styles)` => object
  * Nearly identical to `u$.getStyles`, but does not take a callback, and the styles in the passed-in object are applied to the element. E.g,

```javascript
$el.css({opacity: 1, height: '100px'});
u$.getStyles($el, {opacity: 0, height: 0}); // {opacity: 1, height: '100px'}
$el.css('opacity'); // 0
$el.css('height'); // 0
```

- `resetMappedStyles($element, styles, callback)` => variable
  * Maps styles to an element, executes a callback (which is passed the element), and then resets the old styles. Returns the result of executing the callback. E.g.,

```javascript
// returns the actual height of an element, without the padding or border
u$.resetMappedStyles($el, {
  paddingTop: 0,
  paddingBottom: 0,
  borderTop: 0,
  borderBottom: 0
}, function($el) {
    return $el.get(0).offsetHeight;
});
```

- `height($element)` => number
  * Returns the full height of an element.

- `slideUp($element, height, options)`
  * Identical to the native jQuery `slideUp` plugin, but provides the option to slide up to a specific height. Padding and margin also animated. The options, however, must be passed as an object. **NOTE**: `$.fn.slideUp`plugin is provided for Zepto.

- `slideDown($element, height, options)`
  * Identical to the native jQuery `slideDown` plugin, but provides the option to slide to a specific height. Padding and margin also animated. The options, however, must be passed as an object. **NOTE**: `$.fn.slideDown`plugin is provided for Zepto.

- `detach(object, namespace, properties)` => array
  * Helper method for detaching namespaced events and cleaning references to object properties. The properties can either be passed as an array or as part of the arguments list. Returns an array of old properties. E.g.,

```javascript
var obj = {$el: $(document.body), count: 3},
  old = u$.detach(obj, 'myNamespace', '$el', 'count'); // [$(document.body), 3]
  // $(document.body)  no longer has 'myNamespace' events attached.
```

- `render(parent, data, prepend?)` => `$` element
  * Creates a new element from either a string or an array of data that can be passed to `$`, and adds it to a parent element. If the third argument is `true`, the new element will be added as the first child of the parent. Otherwise, it will be added as the last child of the parent.

- `renderJSON($element, jsonString, template)`
  * Passes a JSON string to a tempting engine that will generate the HTML to be inserting into an element (via `innerHTML`). The third argument is the template that will be used to generate the HTML from the JSON data. If the JSON is very simple and only one level deep (for example, `[{"id": 1, title: "Article 1"}, {"id": 2, "Article 2"}]` or `{"id": 1, title: "Article 1"}`, then the built-in template parser will suffice. Otherwise, you can specify a function that takes the element and JSON object (not string) and use a more powerful templating engine like Handlebars:

```javascript
function($container, data) {
  var source = $('#handlebars-template').html(),
    template = Handlebars.compile(source);

  $container.html(template(data));
}
```

## Mixins
- `cacheMixin`
  * A mixin to set up cache management. Provides two methods: `setCache` and `getCache`. Note that the parent should have an `options` object with a boolean `cache` value.

Caching can be turned on/off via the parent object's `options.cache` property.

Example:

```javascript
var proto = $.extend({
  options: {
    cache: true
  },

  show: function(query) {
    if (this.getCache(query)) {
      this.$container.html(this.getCache(query));
    } else {
      $.ajax({
        complete: function(data, status, xhr) {
          this.setCache(query, xhr.responseText);
          this.$container.html(xhr.responseText);
        }.bind(this)
      });
    }
  }
}, u$.cacheMixin);
```
- `loaderMixin`
  * Mixin for displaying an AJAX loader/spinner. Objects implement this will be decorated with `showLoader` and `hideLoader` methods. A CSS class can be added to the loader element by specifying a `loaderClass` option on the parent object's `options` object.
  * The HTML for the loader element can be specified via a `loaderHTML` string option on the parent object's `options` object.

Example:

```javascript
var proto = $.extend({
  options: {
    loaderClass: 'loader--search',
    loaderHTML: '<span />'
  },

  show: function() {
    this.showLoader(function() {
      console.log('loader displayed');
    });
  },

  hide: function() {
    this.hideLoader();
  }
}, u$.loaderMixin);
```

## Extras (not included in the build)
- `decorate(proto, decorators)` => object
  * Decorator pattern implementation. Takes two objects:
    1. A prototype object; adds to it `decorate(methodToDecorate, decoratorName)` and `undecorate(methodToUndecorate, decoratorName)` methods.
    2. An object of method names containing the details of which methods can be used to decorate them. The key must be the name of a method on `proto`, and the value must be an array of methods. These methods can either be a string representing the name of a method on `proto`, or an object with a "name" (string) and "fn" (function) values.

Example:

```javascript
var proto = u$.decorate({
  getPrice: function() {
    this.price || (this.price = 10);
    return this.toCurrency(this.price);
  },

  toCurrency: function(unit) {
    return Number(unit.toFixed(2));
  },

  addStateTax: function(price) {
    return this.toCurrency(price * 1.08);
  }
}, {
  getPrice: ['addStateTax', {
    name: 'addLocalTax',
    fn: function(price) {
      return this.toCurrency(price * 1.02);
    }
  }]
});

var instance = Object.create(proto);
instance.decorate('getPrice', 'addLocalTax');
instance.getPrice(); // 10.20
instance.undecorate('getPrice', 'addLocalTax');
instance.getPrice(); // 10.00
```