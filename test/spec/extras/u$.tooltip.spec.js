describe('u$ Tooltip', function() {
  'use strict';

  var instance,
    $body,
    $a,
    $tip;

  function cleanUp() {
    $a.remove();
    $tip.remove();
    u$.detach(instance, '$tip');
    $(document.body).off();
  }

  function loadElements() {
    $body = $(document.body);
    $tip = $('<div />').css('width', '1px').appendTo($body);
    $a = $('<a class="js-showTip" />').appendTo($body);
  }

  function resetAndTrigger(options) {
    var e = $.Event('mousemove');
    e.pageX = 100;
    e.pageY = 100;

    cleanUp();
    loadElements();

    instance = u$.tooltip($body, options);
    instance.$tip.css('width', '1px');
    $a.trigger(e);
  }

  beforeEach(function() {
    loadElements();

    instance = u$.tooltip($body, {
      delegate: '.js-showTip',
      useMousePosition: false
    });
    instance.$tip.css('width', '1px');
  });
  afterEach(function() {
    cleanUp();
  });

  describe('when instances are created', function() {
    it('generates the tip from an HTML string', function() {
      expect(instance.$tip).toBeDefined();
      expect(instance.$tip.get(0).nodeName.toLowerCase()).toEqual('div');
      expect(instance.$tip.parent().get(0)).toEqual($body.get(0));
    });

    it('uses an arbitrary in-page element as the tip', function() {
      instance.options.tipElement = $tip;
      instance.setTip();
      expect(instance.$tip).toEqual($tip);
    });

    it('adds the specified class to the tooltip', function() {
      expect(instance.$tip).toHaveClass('tooltip');
    });

    it('hides the tooltip', function() {
      expect(instance.$tip).not.toHaveClass('is-visible');
    });

    it('hides a tooltip from screen readers by default', function() {
      expect(instance.$tip.attr('aria-hidden')).toEqual('true');
    });

    it('does not hide a tooltip from screen readers', function() {
      instance.options.hideFromScreenReaders = false;
      instance.setTip();
      expect(instance.$tip.attr('aria-hidden')).toEqual('false');
    });
  });

  describe('tooltip triggers', function() {
    beforeEach(function() {
      spyOn(instance, 'show');
      spyOn(instance, 'hide');
    });

    it('displays the tooltip when a trigger is moused over', function() {
      $a.trigger('mouseenter');
      expect(instance.show).toHaveBeenCalled();
    });

    it('hides the tooltip when the mouse leaves a trigger', function() {
      $a.trigger('mouseenter').trigger('mouseleave');
      expect(instance.hide).toHaveBeenCalled();
    });

    it('displays the tooltip when the trigger gains keyboard focus', function() {
      $a.trigger('focusin');
      expect(instance.show).toHaveBeenCalled();
    });

    it('hides the tooltip when the trigger loses focus', function() {
      $a.trigger('focus').trigger('blur');
      expect(instance.hide).toHaveBeenCalled();
    });
  });

  describe('when a tooltip is displayed', function() {
    beforeEach(function() {
      $a.trigger('mouseenter');
    });

    it('adds the "tip is displayed" class to the tooltip', function() {
      expect(instance.$tip).toHaveClass('is-visible');
    });

    it('removes the "tip is hidden" class from the tooltip', function() {
      expect(instance.$tip).not.toHaveClass('is-invisible');
    });

    it('moves the tip to the position of the moused-over element', function() {
      var pos = $a.position();

      expect(instance.$tip.css('position')).toEqual('absolute');
      expect(instance.$tip.css('top')).toEqual(pos.top + 10 + 'px');
      expect(instance.$tip.css('left')).toEqual(pos.left + 15 + 'px');
    });

    it('uses the mouse position to determine the tooltip position', function() {
      resetAndTrigger({
        delegate: '.js-showTip',
      });
      expect(instance.$tip.css('top')).toEqual('110px');
      expect(instance.$tip.css('left')).toEqual('115px');
    });

    it('offsets the tip from the generated position', function() {
      resetAndTrigger({
        delegate: '.js-showTip',
        offset: {
          left: 10,
          top: 10
        }
      });
      expect(instance.$tip.css('top')).toEqual('110px');
      expect(instance.$tip.css('left')).toEqual('110px');
    });

    it("sets the trigger's `aria-describedby` attribute to the" +
        " tooltip's `id` attribute", function() {
      var id = instance.$tip.attr('id');

      expect(id).toBeDefined();
      expect(id).not.toBeEmpty();
      expect($a.attr('aria-describedby')).toEqual(id);
    });
  });

  describe('when a tooltip is hidden', function() {
    beforeEach(function() {
      $a.trigger('mouseenter').trigger('mouseleave');
    });

    it('adds the "tip is hidden" class to the tooltip', function() {
      expect(instance.$tip).toHaveClass('is-invisible');
    });

    it('removes the "tip is displayed" class from the tooltip', function() {
      expect(instance.$tip).not.toHaveClass('is-visible');
    });

    it("removes the trigger's `aria-describedby` attribute", function() {
      expect($a.attr('aria-describedby')).not.toBeDefined();
    });
  });

  describe('when the tooltip text is generated', function() {
    var text = 'Lorem ipsum dolor sit amet';

    beforeEach(function() {
      $a.attr('title', text).
          data('id', '12345').
          data('text', text).
          trigger('mouseenter');
    });

    it('uses the trigger\'s `title` attribute', function() {
      expect(instance.$tip.text()).toEqual(text);
    });

    it('moves the `title` text into a `tiptitle` attribute', function() {
      expect($a.data('tiptitle')).toEqual(text);
      expect($a.attr('title')).toEqual('');
    });

    it('restores the `title` text after the tip is hidden', function() {
      $a.trigger('mouseleave');
      expect($a.data('tiptitle')).not.toBeDefined();
      expect($a.attr('title')).toEqual(text);
    });

    it('generates a tip from a template', function() {
      instance.options.template = '<div data-id="{{id}}">{{text}}</div>';

      // `mouseenter` has already been triggered at this point.
      // Hide and re-display the mouse to force the template to take effect.
      $a.trigger('mouseleave').trigger('mouseenter');
      expect(instance.$tip.html()).toEqual('<div data-id="12345">' +
          text + '</div>');
    });
  });
});