/**
 * Moves an element to the specified location or element, and is
 * boundary-aware, so moveable elements will not be displayed off-screen.
 *
 * 
 */
(function($, window) {
'use strict';

window.u$ || (window.u$ = {});

// If the width of $el is equal to the window width, then ignore the offset
// and let the CSS determine the styles.
//
// If the width of $el plus the total left offset is greater than the window
// width, then $el will be displayed off the right edge of the screen. To
// prevent this, move it to just off the right edge.
//
// Otherwise, move $el to passed-in coordinates.
function calculateLeft($el, position, offset) {
  var w = $el.width(),
    winW = $(window).width();

  return (w === winW) ? 0 : (w + position.left + offset.left > winW) ?
      winW - w - offset.left :
      position.left + offset.left;
}

var defaults = {
    offset: {
      left: 0,
      top: 0
    }
  },

  positionProto = {
    initialize: function($el, options) {
      this.options = $.extend({}, defaults, (options || null));
      this.$el = $el;
    },

    move: function($to) {
      var position = $.isPlainObject($to) ? $to : $to.position();

      this.$el.css({
        position: 'absolute',
        top: position.top + this.options.offset.top,
        left: calculateLeft(this.$el, position, this.options.offset)
      });
      return this;
    }
  };

u$.position = function() {
  var instance = Object.create(positionProto);
  instance.initialize.apply(instance, arguments);
  return instance;
};

})((window.Zepto || window.jQuery), window);