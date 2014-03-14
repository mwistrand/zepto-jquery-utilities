describe('u$.position', function() {
  'use strict';

  var instance,
    $a,
    $moveable;

  beforeEach(function() {
    jasmine.Clock.useMock();

    // set the width on both elements to 1px so that the width of the browser
    // running in the background doesn't throw off the tests.
    $moveable = $('<div />').css('width', '1px').appendTo(document.body);
    instance = u$.position($moveable);
    $a = $('<a />').css({
      display: 'block',
      height: '1px',
      width: '1px'
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

  it('moves an element to the specified object of coordinates', function() {
    instance.move({
      top: 100,
      left: 100
    });
    expect($moveable.css('top')).toEqual('100px');
    expect($moveable.css('left')).toEqual('100px');
  });

  it('moves an element to the position of another element', function() {
    instance.move($a);
    expect($moveable.css('position')).toEqual('absolute');
    expect($moveable.css('top')).toEqual('100px');
    expect($moveable.css('left')).toEqual('100px');
  });

  it('offsets the element by the specified number of pixels', function() {
    instance.options = {
      offset: {
        top: 10,
        left: 10
      }
    };

    instance.move($a);
    expect($moveable.css('position')).toEqual('absolute');
    expect($moveable.css('top')).toEqual('110px');
    expect($moveable.css('left')).toEqual('110px');
  });
});