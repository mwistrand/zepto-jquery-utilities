(function($, global) {
'use strict';

global.u$ || (global.u$ = {});

var defaults = {
    // delegate: '.js-showMenu',

    hideFromScreenReaders: false,
    menuClass: 'contextMenu',
    menuElement: '<div />'
  },

  menuProto = {
    initialize: function($el, mover, options) {
      this.$el = $el;
      this.mover = mover;

      this.setOptions(options);
      this.setMenu();
      this.attach();
    },

    setOptions: function(options) {
      this.options = $.extend({}, defaults, options);

      this.mover.setOptions({
        hideClass: this.options.hideClass,
        offset: this.options.offset,
        showClass: this.options.showClass
      });
    },

    setMenu: function() {
      var opts = this.options,
        menu = opts.menuElement,
        doHide = (!!opts.hideFromScreenReaders).toString();

      this.$menu = u$.is$(menu) ? menu : $(menu).appendTo(document.body);

      this.$menu.attr('aria-hidden', doHide);
      this.mover.hide(this.$menu.addClass(opts.menuClass));
    },

    attach: function() {
      this.$el.on({
        click: $.proxy(function(e) {
          this.show($(e.currentDelegate));
        }, this)
      }, this.options.delegate);
    },

    show: function($clicked) {
      
    },

    hide: function() {
      
    }
  };

u$.contextMenu = function($el, options) {
  var mover = Object.create(u$.position);

  return u$.create(menuProto, null, $el, mover, options);
};

})((window.Zepto || window.jQuery), window);