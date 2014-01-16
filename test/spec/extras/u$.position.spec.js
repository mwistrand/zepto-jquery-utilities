describe('u$ Tooltip', function() {
  'use strict';

  var instance,
    $a,
    $moveable;

  beforeEach(function() {
    jasmine.Clock.useMock();

    instance = Object.create(u$.position);

    $moveable = $('<div />').appendTo(document.body);
    $a = $('<a />').css({
      display: 'block',
      height: '10px',
      width: '10px'
    }).appendTo(document.body);

    spyOn($a, 'position').andCallFake(function() {
      return {
        left: 100,
        top: 100
      };
    });
  });

  afterEach(function() {
    $a.remove();
    $moveable.remove();
  });

  it('moves an element to the position of another element', function() {
    instance.move($moveable, $a);
    expect($moveable.css('position')).toEqual('absolute');
    expect($moveable.css('top')).toEqual('110px');
    expect($moveable.css('left')).toEqual('100px');
  });

  it('moves an element to the specified object of coordinates', function() {
    instance.move($moveable, $a, {
      top: 100,
      left: 100
    });
    expect($moveable.css('top')).toEqual('110px');
    expect($moveable.css('left')).toEqual('100px');
  });

  it('offsets the element by the specified number of pixels', function() {
    instance.options = {
      offset: {
        top: 10,
        left: 10
      }
    };

    instance.move($moveable, $a);
    expect($moveable.css('position')).toEqual('absolute');
    expect($moveable.css('top')).toEqual('120px');
    expect($moveable.css('left')).toEqual('110px');
  });

  it('moves and displays an element', function() {
    spyOn(instance, 'move');
    instance.show($moveable, $a);
    expect(instance.move).toHaveBeenCalled();
    expect($moveable).toHaveClass('is-visible');
  });

  it('hides an element', function() {
    instance.show($moveable, $a).hide($moveable);
    expect($moveable).not.toHaveClass('is-visible');
  });
});