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
    $tip = $('<div />').appendTo($body);
    $a = $('<a class="js-showTip" />').appendTo($body);
  }

  function resetAndTrigger(options) {
    var e = $.Event('mousemove');
    e.pageX = 100;
    e.pageY = 100;

    cleanUp();
    loadElements();

    instance = u$.tooltip($body, options);

    $a.trigger(e);
  }

  beforeEach(function() {
    jasmine.Clock.useMock();
    loadElements();

    instance = u$.tooltip($body, {
      delegate: '.js-showTip',
      hideDelay: 0,
      useMousePosition: false
    });
  });
  afterEach(function() {
    cleanUp();
  });

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

  it('hides a tooltip when the tip is created.', function() {
    expect(instance.$tip).not.toHaveClass('is-visible');
  });

  it('displays a tooltip when an element is moused over', function() {
    $a.trigger('mouseenter');
    expect(instance.$tip).toHaveClass('is-visible');
  });

  it('hides a tooltip on mouse out', function() {
    $a.trigger('mouseenter').trigger('mouseleave');
    jasmine.Clock.tick(100);
    expect(instance.$tip).not.toHaveClass('is-visible');
  });

  it('adds a state class when the tip is displayed', function() {
    instance.options.showClass = 'is-displayed';
    instance.setOptions(instance.options);
    $a.trigger('mouseenter');
    expect(instance.$tip).toHaveClass('is-displayed');
  });

  it('removes a state class when the tip is displayed', function() {
    instance.options.showClass = 'is-hidden';
    instance.setOptions(instance.options);
    $a.trigger('mouseenter').trigger('mouseleave');
    expect(instance.$tip).toHaveClass('is-hidden');
  });

  it('hides a tip after a delay', function() {
    instance.options.hideDelay = 500;
    $a.trigger('mouseenter').trigger('mouseleave');
    expect(instance.$tip).toHaveClass('is-visible');
    jasmine.Clock.tick(500);
    expect(instance.$tip).not.toHaveClass('is-visible');
  });

  it('moves the tip to the position of the moused-over element', function() {
    var pos = $a.position();

    $a.trigger('mouseenter');
    expect(instance.$tip.css('position')).toEqual('absolute');
    expect(instance.$tip.css('top')).toEqual(pos.top + 10 + 'px');
    expect(instance.$tip.css('left')).toEqual(pos.left + 15 + 'px');
  });

  it('uses the mouse position to determine the tooltip position', function() {
    resetAndTrigger({
      delegate: '.js-showTip',
      hideDelay: 0
    });
    expect(instance.$tip.css('top')).toEqual('110px');
    expect(instance.$tip.css('left')).toEqual('115px');
  });

  it('offsets the tip from the generated position', function() {
    resetAndTrigger({
      delegate: '.js-showTip',
      hideDelay: 0,
      offset: {
        left: 0,
        top: 0
      }
    });
    expect(instance.$tip.css('top')).toEqual('100px');
    expect(instance.$tip.css('left')).toEqual('100px');
  });

  it('generates the tip body from a `title` attribute', function() {
    var text = 'Lorem ipsum dolor sit amet';

    $a.attr('title', text).trigger('mouseenter');
    expect(instance.$tip.text()).toEqual(text);
  });

  it('removes the `title` text before the tip is displayed', function() {
    var text = 'Lorem ipsum dolor sit amet';

    $a.attr('title', text).trigger('mouseenter').trigger('mouseleave');
    expect($a.data('tiptitle')).toEqual(text);
    expect($a.attr('title')).toEqual('');
  });

  it('restores the `title` text after the tip is hidden', function() {
    var text = 'Lorem ipsum dolor sit amet';

    $a.attr('title', text).trigger('mouseenter').trigger('mouseleave');
    jasmine.Clock.tick(100);
    expect($a.data('tiptitle')).not.toBeDefined();
    expect($a.attr('title')).toEqual(text);
  });

  it('generates a tip from a template', function() {
    var text = 'Lorem ipsum dolor sit amet';
    instance.options.template = '<div data-id="{{id}}">{{text}}</div>';

    $a.data('id', '12345').data('text', text).trigger('mouseenter');
    expect(instance.$tip.html()).toEqual('<div data-id="12345">' +
        text + '</div>');
  });

  it('hides a tooltip from screen readers', function() {
    expect(instance.$tip.attr('aria-hidden')).toEqual('true');
  });

  it('does not hide a tooltip from screen readers', function() {
    instance.options.hideFromScreenReaders = false;
    instance.setTip();
    expect(instance.$tip.attr('aria-hidden')).toEqual('false');
  });
});