describe('Slide up', function() {
  'use strict';

  var $div;

  beforeEach(function() {
    setFixtures(sandbox());
    $div = $('#sandbox').css({
      'height': '300px',
      'width': '300px'
    });
    $.fx.off = true;
    jasmine.Clock.useMock();
  });

  it('collapses an element', function() {
    u$.slideUp($div);

    jasmine.Clock.tick(300);
    expect($div.css('display')).toEqual('none');
    expect($div.css('height')).toEqual('300px');
  });

  it('resets the overflow if originally `scroll`', function() {
    $div.css('overflow', 'scroll');
    u$.slideUp($div);
    jasmine.Clock.tick(300);
    expect($div.css('overflow-y')).toEqual('scroll');
  });

  it('can collapse to a minimum height', function() {
    u$.slideUp($div, 100);
    jasmine.Clock.tick(300);
    expect($div.css('height')).toEqual('100px');
  });

  it('resets the original margin and padding', function() {
    $div.css({
      margin: '10px',
      padding: '10px'
    });
    u$.slideUp($div);
    jasmine.Clock.tick(300);
    expect($div.css('margin-top')).toEqual('10px');
  });
});