describe('u$ Cache Mixin', function() {
  'use strict';
  
  var proto = $.extend({
      options: {
        cache: true
      }
    }, u$.cacheMixin),
    instance;

  beforeEach(function() {
    instance = Object.create(proto);
  });

  it('provides `setCache` and `getCache` methods', function() {
    expect($.isFunction(instance.setCache)).toBe(true);
    expect($.isFunction(instance.getCache)).toBe(true);
  });

  it('adds an item to the cache', function() {
    instance.setCache('test', '1');
    expect(instance._cache.test).toEqual('1');
  });

  it('retrieves an item from the cache', function() {
    instance.setCache('test', '1');
    expect(instance.getCache('test')).toEqual('1');
    expect(instance.getCache('test2')).not.toBeDefined();
  });
});