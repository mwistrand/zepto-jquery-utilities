/**
 * Mixin for displaying an AJAX loader/spinner. Objects implement this will
 * be decorated with `showLoader` and `hideLoader` methods.
 *
 * A CSS class can be added to the loader element by specifying a
 * `loaderClass` option on the parent object's `options` object.
 *
 * The HTML for the loader element can be specified via a `loaderHTML`
 * string option on the parent object's `options` object.
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
   * @param beforeShow A callback to execute before the loader is shown.
   *        This is useful for adding other elements such as a darkened
   *        overlay.
   *
   * @returns `this`
   */
  showLoader: function(beforeShow) {
    var options = this.options;

    if ($.isFunction(beforeShow)) {
      beforeShow();
    }

    this.$loader = $((options && options.loaderHTML) || '<div />').
        addClass('loader');

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