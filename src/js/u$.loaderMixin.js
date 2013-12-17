(function($) {
'use strict';

window.u$ || (window.u$ = {});

u$.loaderMixin = {
  //options: {
  //  loaderClass: 'loader',
  //  loaderHTML: '<div />'
  //},
  
  /**
   * @param beforeShow A callback to execute before the loader is shown.
   *        This is useful for adding other elements such as a darkened
   *        overlay.
   */
  showLoader: function(beforeShow) {
    if (this.options.loaderClass) {

      if ($.isFunction(beforeShow)) {
        beforeShow();
      }

      this.$loader = $((this.options.loaderHTML || '<div />')).
          .addClass('loader').addClass(this.options.loaderClass);
    }
  },

  hideLoader: function() {
    if (this.$loader) {
      this.$loader.remove();
      this.$loader = null;
    }
  }
};

})(window.Zepto || window.jQuery);