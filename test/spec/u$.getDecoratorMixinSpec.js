describe('u$ Decorator Mixin', function() {
  'use strict';

  var proto = {
    getPrice: function() {
      this.price || (this.price = 10);
      return this.reduceDecorators(this.toCurrency(this.price));
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
  },
  obj;

  beforeEach(function() {
    obj = $.extend({}, proto, u$.getDecoratorMixin('addFedTax','addStateTax'));
  });
  afterEach(function() {
    obj = null;
  });

  it('adds decorator methods to an object', function() {
    expect($.isFunction(obj.decorate)).toBe(true);
    expect($.isFunction(obj.reduceDecorators)).toBe(true);
  });

  it('accepts an array of decorators', function() {
    var obj = $.extend({}, proto,
        u$.getDecoratorMixin(['addFedTax', 'addStateTax']));

    spyOn(obj, 'addFedTax');
    spyOn(obj, 'addStateTax');
    obj.decorate('addFedTax');
    obj.decorate('addStateTax');
    obj.getPrice();

    expect(obj.addFedTax).toHaveBeenCalled();
    expect(obj.addStateTax).toHaveBeenCalled();
  });

  it('accepts an arguments list of decorators', function() {
    spyOn(obj, 'addFedTax');
    spyOn(obj, 'addStateTax');
    obj.decorate('addFedTax');
    obj.decorate('addStateTax');
    obj.getPrice();

    expect(obj.addFedTax).toHaveBeenCalled();
    expect(obj.addStateTax).toHaveBeenCalled();
  });

  it('only calls decorators if they have been added', function() {
    spyOn(obj, 'addFedTax');
    spyOn(obj, 'addStateTax');

    obj.decorate('addFedTax');
    obj.getPrice();

    expect(obj.addFedTax).toHaveBeenCalled();
    expect(obj.addStateTax).not.toHaveBeenCalled();
  });

  it('passes a value to all added decorator methods', function() {
    obj.decorate('addFedTax');
    obj.decorate('addStateTax');

    expect(obj.getPrice()).toEqual(11.23);
  });

  it('removes a decorator from the list', function() {
    obj.decorate('addFedTax').undecorate('addFedTax');

    expect(obj.getPrice()).toEqual(10.00);
  });
});