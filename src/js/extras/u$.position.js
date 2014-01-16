(function($, global) {
'use strict';

global.u$ || (global.u$ = {});

var defaults = {
  showClass: 'is-visible',
  offset: {
    left: 0,
    top: 0
  }
};

u$.position = {
  setOptions: function(options) {
    this.options = $.extend({}, defaults, options);

    return this.options;
  },

  move: function($el, $to, coords) {
    var position = coords || $to.position(),
      opts = this.options || this.setOptions(),
      offset = opts.offset;

    $el.css({
      position: 'absolute',
      top: position.top + $to.height() + offset.top,
      left: position.left + offset.left
    });

    return this;
  },

  show: function($el, $to, coords) {
    this.options || (this.options = this.setOptions());
    this.move($el, $to, coords);
    $el.addClass(this.options.showClass);

    return this;
  },

  hide: function($el) {
    this.options || (this.options = this.setOptions());
    $el.removeClass(this.options.showClass);

    return this;
  }
};

})((window.Zepto || window.jQuery), window);