describe('Slide Down', function() {
  'use strict';

  var $div;

  beforeEach(function() {
    setFixtures(sandbox());
    $div = $('#sandbox').css({
      'height': '300px',
      'width': '300px',
      'display': 'none'
    });
    $.fx.off = true;
    jasmine.Clock.useMock();
  });

  it('expands an element', function() {
    u$.slideDown($div);

    jasmine.Clock.tick(300);
    expect($div.css('display')).toEqual('block');
    expect($div.css('height')).toEqual('300px');
  });

  it('resets the overflow if originally `scroll`', function() {
    $div.css('overflow', 'scroll');
    u$.slideDown($div);
    jasmine.Clock.tick(300);
    expect($div.css('overflow-y')).toEqual('scroll');
  });

  it('can expand to a maximum height', function() {
    u$.slideDown($div, 100);
    jasmine.Clock.tick(300);
    expect($div.css('height')).toEqual('100px');
  });

  it('resets the original margin and padding', function() {
    $div.css({
      margin: '10px',
      padding: '10px'
    });
    u$.slideDown($div);
    jasmine.Clock.tick(300);
    expect($div.css('margin-top')).toEqual('10px');
  });
});