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

  describe('with an optional `beforeFn`', function() {
    it('calls `beforeFn` before `initialize`', function() {
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

    describe('when `beforeFn` returns an array', function() {
      var args;

      beforeEach(function() {
        u$.createFactory({
          initialize: function() {
            args = arguments;
          }
        }, function() {
          return [1,2,3];
        })();
      });

      it('use the array the arguments for `initialize`', function() {
        expect(args[0]).toEqual(1);
        expect(args[1]).toEqual(2);
        expect(args[2]).toEqual(3);
      });
    });

    describe('when `beforeFn` does not return an array', function() {
      var args,
        proto;

      beforeEach(function() {
        proto = {
          initialize: function() {
            args = arguments;
          }
        }
      });

      it('passes the original arguments to `initialize`', function() {
        u$.createFactory(proto, function() {})(2,3,4);

        expect(args[0]).toEqual(2);
        expect(args[1]).toEqual(3);
        expect(args[2]).toEqual(4);
      });
    });
  });
});