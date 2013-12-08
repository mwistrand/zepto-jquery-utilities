(function($) {
'use strict';

window.u$ || (window.u$ = {});

u$.loaderMixin = {
  //options: {
  //  loaderClass: 'loader--modal',
  //  loaderHTML: '<div />'
  //},
  
  showLoader: function() {
    if (this.options.loaderClass) {
      this.showOverlay();
      this.$loader = $((this.options.loaderHTML || '<div />')).
          addClass(this.options.loaderClass);
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