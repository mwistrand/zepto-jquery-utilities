(function($, global, document) {
'use strict';

global.u$ || (global.u$ = {});

function setID($el) {
  if (!$el.attr('id')) {
    $el.attr('id', 'tooltip-' + +new Date());
  }
}

var defaults = {
    // delegate: '.js-showTip',
    // $tip: $('#uniqueTip') || '<div />'
    
    hideClass: 'is-invisible',
    hideDelay: 100,
    hideFromScreenReaders: true,
    offset: {
      left: 15,
      top: 10
    },
    showClass: 'is-visible',
    tipElement: '<div />',
    tipClass: 'tooltip',
    useMousePosition: true
  },

  setEvent = (function() {
    function show(e) {
      this.show($(e.currentTarget));
    }
    function hide() {
      this.hide();
    }

    var callbacks = {
      focus: show,
      mouseenter: show,
      blur: hide,
      mouseleave: hide,

      mousemove: function(e) {
        this.show($(e.currentTarget), {
          left: e.pageX,
          top: e.pageY
        });
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

      setID(this.$tip);
      this.$tip.attr('aria-hidden', doHide).addClass(opts.tipClass);
      this.hide(true);
    },

    attach: function() {
      var showEvent = this.options.useMousePosition ?
          'mousemove' : 'mouseenter',
        $el = this.$el,
        delegate = this.options.delegate;
      
      setEvent.call(this, 'focus', $el, delegate);
      setEvent.call(this, showEvent, $el, delegate);
      setEvent.call(this, 'blur', $el, delegate);
      setEvent.call(this, 'mouseleave', $el, delegate);
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
      if (!this.$current) {
        this.$current = $to;

        this.render($to);
        $to.attr('aria-describedby', this.$tip.attr('id'));
      }

      this.$tip.moveTo(mousePos || $to, this.options.offset).
          removeClass(this.options.hideClass).
          addClass(this.options.showClass);
    },

    hide: function(force) {
      this.$tip.removeClass(this.options.showClass).
          addClass(this.options.hideClass);

      if (this.$current) {
        this.$current.attr('title', this.$current.data('tiptitle')).
            removeData('tiptitle').removeAttr('aria-describedby');

        this.$current = null;
      }
    }
  };

u$.tooltip = function() {
  var instance = Object.create(tooltipProto);
  instance.initialize.apply(instance, arguments);
  return instance;
};

})((window.Zepto || window.jQuery), window, document);