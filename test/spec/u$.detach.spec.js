describe('u$ Detach', function() {
  'use strict';

  var namespace = 'detachTest',
    obj,
    $div,
    $a;

  beforeEach(function() {
    loadFixtures('u$.detach.html');
    $div = $('.js-container');
    $a = $('.js-trigger');

    obj = {
      click: function() {
        obj.callThrough();
      },
      callThrough: function() {},
      $div: $div,
      $a: $a
    };
    $div.on('click.' + namespace, obj.click);
  });
  afterEach(function() {
    $div.remove();
    $a.remove();
    $div = $a = obj = null;
  });

  it('detaches all events from the passed-in properties', function() {
    spyOn(obj, 'callThrough');
    u$.detach(obj, namespace, '$div', '$a');
    $div.trigger('click');
    $a.trigger('click');
    expect(obj.callThrough).not.toHaveBeenCalled();
  });

  it('it nulls object properties', function() {
    u$.detach(obj, namespace, '$div', '$a');
    expect(obj.$div).toBe(null);
    expect(obj.$a).toBe(null);
  });

  it('returns an array of old properties', function() {
    var old = u$.detach(obj, namespace, '$div', '$a');
    expect($.isArray(old)).toBe(true);
    expect(old.length).toEqual(2);
    expect(u$.is$(old[1])).toBe(true);
  });
});