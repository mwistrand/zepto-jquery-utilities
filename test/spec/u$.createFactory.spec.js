describe('u$.createFactory', function() {
  'use strict';

  it('returns a function that creates a new object', function() {
    var proto = {},
      factory = u$.createFactory(proto),
      instance = factory();

    expect(proto.isPrototypeOf(instance)).toBe(true);
  });

  it('uses a function to determine the prototype', function() {
    var proto = {},
      factory = u$.createFactory(function() {
        return proto;
      }),
      instance = factory();

    expect(proto.isPrototypeOf(instance)).toBe(true);
  });

  it('calls an `initialize` function', function() {
    var count = 0,
      proto = {
        initialize: function() {
          count += 1;
        }
      },
      factory = u$.createFactory(proto),
      instance = factory();

    expect(count).toEqual(1);
  });

  it('passes arguments to the `initialize` method', function() {
    var count = 0,
      proto = {
        initialize: function(a, b, c) {
          count = a + b + c;
        }
      },
      factory = u$.createFactory(proto),
      instance = factory(1, 1, 1);

    expect(count).toEqual(3);
  });

  it('calls an optional function before initialize is called', function() {
    var count = 0,
      proto = {
        initialize: function() {
          count += 1;
        }
      },
      factory = u$.createFactory(proto, function() {
        count = 4;
      }),
      instance = factory();

    // If `initialize` is called first, then `count` will be 4.
    // Otherwise, it will be 5.
    expect(count).toEqual(5);
  });

  it('passes arguments to the `before` method', function() {
    var count = 0,
      factory = u$.createFactory({}, function(a, b, c) {
        count = a + b + c;
      }),
      instance = factory(1, 1, 1);

    expect(count).toEqual(3);
  });

  it('binds `before` to `instance`', function() {
    var factory = u$.createFactory({}, function() {
        this.foo = 'bar';
      }),
      instance = factory();

    expect(instance.foo).toBe('bar');
  });
});