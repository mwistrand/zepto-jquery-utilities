describe('u$.create', function() {
  'use strict';
  
  var instance,
    proto = {
      initialize: function() {
        this.i || (this.i = 0);
        this.i += 1;

        this.l = arguments.length;
      }
    };

  it('creates an instance of a prototype', function() {
    instance = u$.create(proto);

    expect(proto.isPrototypeOf(instance)).toBe(true);
  });

  it('executes an optional callback before `initialize`', function() {
    instance = u$.create(proto, function(instance) {
      instance.i = 1;
    });

    expect(instance.i).toEqual(2);
  });

  it('executes an optional `initialize` method', function() {
    expect(function() {
      instance = u$.create({});
    }).not.toThrow();

    instance = u$.create({
      initialize: jasmine.createSpy('init')
    });

    expect(instance.initialize).toHaveBeenCalled();
  });

  it('passes arguments to `initialize`', function() {
    instance = u$.create(proto, null, 1, 2, 3);

    expect(instance.l).toEqual(3);
  });
});