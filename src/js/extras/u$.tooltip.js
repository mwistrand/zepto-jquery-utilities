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
    initialize: function($el, mover, options) {
      this.$el = $el;
      this.mover = mover;

      this.setOptions(options);
      this.setTip();
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

    setTip: function() {
      var opts = this.options,
        tip = opts.tipElement,
        doHide = (!!opts.hideFromScreenReaders).toString();

      this.$tip = u$.is$(tip) ? tip : $(tip).appendTo(document.body);

      this.$tip.attr('aria-hidden', doHide);
      this.mover.hide(this.$tip.addClass(opts.tipClass));
    },

    attach: function() {
      var showEvent = this.options.useMousePosition ?
          'mousemove' : 'mouseenter';
      
      setEvent.call(this, showEvent, this.$el, this.options.delegate);
      setEvent.call(this, 'mouseleave', this.$el, this.options.delegate);
    },

    show: function($to, mousePos) {
      clearTimeout(this.timer);
      this.render($to);
      this.mover.show(this.$tip, $to, mousePos);
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

    hide: function() {
      this.timer = setTimeout(function() {
        this.mover.hide(this.$tip);
      }.bind(this), this.options.hideDelay);
    }
  };

u$.tooltip = function($el, options) {
  var mover = Object.create(u$.position);

  return u$.create(tooltipProto, null, $el, mover, options);
};

})((window.Zepto || window.jQuery), window, document);