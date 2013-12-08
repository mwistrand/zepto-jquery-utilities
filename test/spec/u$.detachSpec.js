describe('u$ Detach', function() {
  'use strict';

  var namespace = 'detachTest',
    click = function() {},
    obj,
    $div,
    $a;

  beforeEach(function() {
    // set $div
    // set $a
    // set obj
  });
  afterEach(function() {
    //$div.remove();
    //$a.remove();
    $div = $a = null;
  });

  it('detaches all events from the passed-in properties', function() {
    //spyOn(obj, 'click');
    //u$.detach(obj, namespace, '$div', '$a');
    //$div.trigger('click');
    //$a.trigger('click');
    //expect(obj.click).not.toHaveBeenCalled();
  });

  it('it nulls object properties', function() {
    //u$.detach(obj, namespace, '$div', '$a');
    //expect(obj.$div).toBe(null);
    //expect(obj.$a).toBe(null);
  });

  it('returns an array of old properties', function() {
    //var old = u$.detach(obj, namespace, '$div', '$a');
    //expect($.isArray(old)).toBe(true);
    //expect(old.length).toEqual(2);
    //expect(u$.instanceOf$(old[1])).toBe(true);
  });
})