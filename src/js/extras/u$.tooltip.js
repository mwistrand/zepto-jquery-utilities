(function($, global, document) {
'use strict';

global.u$ || (global.u$ = {});

var defaults = {
    // delegate: '.js-showTip',
    // hideClass: 'is-invisible',
    // showClass: 'is-visible',
    // $tip: $('#uniqueTip') || '<div />'
    
    hideDelay: 100,
    hideFromScreenReaders: true,
    offset: {
      left: 15,
      top: 10
    },
    tipElement: '<div />',
    tipClass: 'tooltip',
    useMousePosition: true
  },

  setEvent = (function() {
    var callbacks = {
      mouseenter: function(e) {
        this.show($(e.currentTarget));
      },

      mousemove: function(e) {
        this.show($(e.currentTarget), {
          left: e.pageX,
          top: e.pageY
        });
      },

      mouseleave: function() {
        this.hide();
      }
    };

    return function(name, $elems, sel) {
      var nsBase = this.options.eventNamespace || '',
        ns = nsBase + 'Tooltip.' + name + 'Event',
        callback = $.proxy(callbacks[name], this);

      $elems.on(name + '.' + ns, sel, callback);
    };
  })(),

  tooltipProto = {
    initialize: function($el, options) {
      this.options = $.extend({}, defaults, options);
      this.$el = $el;

      this.setTip();
      this.attach();
    },

    setTip: function() {
      var opts = this.options,
        tip = opts.tipElement,
        doHide = (!!opts.hideFromScreenReaders).toString();

      this.$tip = u$.is$(tip) ? tip : $(tip).appendTo(document.body);

      this.$tip.attr('aria-hidden', doHide);
      this.hide(true);
    },

    attach: function() {
      var showEvent = this.options.useMousePosition ?
          'mousemove' : 'mouseenter';
      
      setEvent.call(this, showEvent, this.$el, this.options.delegate);
      setEvent.call(this, 'mouseleave', this.$el, this.options.delegate);
    },

    render: function($to) {
      var template = this.options.template,
        title = $to.attr('title') || '';

      if (template) {
        title = u$.renderJSON(this.$tip, $to.data(), template).html();
      } else {
        title = $to.attr('title');

        this.$tip.text(title);
      }

      $to.attr('title', '').data('tiptitle', title);
    },

    show: function($to, mousePos) {
      clearTimeout(this.timer);
      
      if (!this.$current) {
        this.$current = $to;

        this.render($to);
      }

      this.$tip.removeClass(this.options.hideClass).
          addClass(this.options.showClass);
    },

    hide: function(force) {
      this.timer = setTimeout(function() {
        this.mover.hide(this.$tip);
        this.$tip.removeClass(this.options.hideClass).
            addClass(this.options.showClass);
        this.$current.attr('title', this.$current.data('tiptitle')).
            removeData('tiptitle');

        this.$current = null;
      }.bind(this), force ? 0 : this.options.hideDelay);
    }
  };

u$.tooltip = u$.createFactory(tooltipProto);

})((window.Zepto || window.jQuery), window, document);