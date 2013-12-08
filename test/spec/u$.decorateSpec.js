describe('u$ Decorator Mixin', function() {
  'use strict';
var testI = 0;
  var instance,
    proto = u$.decorate({
      getPrice: function() {
        this.price || (this.price = 10);
        return this.toCurrency(this.price);
      },

      toCurrency: function(unit) {
        return Number(unit.toFixed(2));
      },

      addFedTax: function(price) {
        return this.toCurrency(price * 1.04);
      },

      addStateTax: function(price) {
        return this.toCurrency(price * 1.08);
      }
    }, {
      getPrice: ['addFedTax', 'addStateTax', {
        name: 'addLocalTax',
        fn: function(price) {
          return this.toCurrency(price * 1.02);
        }
      }]
    });

  beforeEach(function() {
    instance = Object.create(proto);
    instance._i = ++testI;
  });
  afterEach(function() {
    instance = null;
  });

  it('adds decorator methods to an object', function() {
    expect($.isFunction(instance.decorate)).toBe(true);
    expect($.isFunction(instance.undecorate)).toBe(true);
  });

  it('accepts decorators that are methods of the passed-in object', function() {
    spyOn(instance, 'addFedTax');
    spyOn(instance, 'addStateTax');
    instance.decorate('getPrice', 'addFedTax').
        decorate('getPrice', 'addStateTax').getPrice();

    expect(instance.addFedTax).toHaveBeenCalled();
    expect(instance.addStateTax).toHaveBeenCalled();
  });

  it('accepts function decorators that will be bound to the passed-in object',
      function() {

    var price = instance.decorate('getPrice', 'addLocalTax').getPrice();

    expect(price).toEqual(10.20);
  });

  it('only calls decorators if they have been added', function() {
    spyOn(instance, 'addFedTax');
    spyOn(instance, 'addStateTax');

    instance.decorate('getPrice', 'addFedTax');
    instance.getPrice();

    expect(instance.addFedTax).toHaveBeenCalled();
    expect(instance.addStateTax).not.toHaveBeenCalled();
  });

  it('passes a value to all added decorator methods', function() {
    instance.decorate('getPrice', 'addFedTax');
    instance.decorate('getPrice', 'addStateTax');

    expect(instance.getPrice()).toEqual(11.23);
  });

  it('removes a decorator from the list', function() {
    instance.decorate('getPrice', 'addFedTax').undecorate('getPrice', 'addFedTax');

    expect(instance.getPrice()).toEqual(10.00);
  });
});