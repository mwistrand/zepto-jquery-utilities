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