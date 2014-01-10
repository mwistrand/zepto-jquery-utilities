describe('u$ Loader Mixin', function() {
  'use strict';
  
  var instance,
    proto = {
      callback: function() {}
    };

  function initialize(opts) {
    if (opts) {
      proto.options = opts;
    }

    instance = $.extend(Object.create(proto), u$.loaderMixin);
  }

  afterEach(function() {
    proto.options = {};
  });

  it('it supports method chaining', function() {
    initialize();
    expect(function() {
      instance.showLoader().hideLoader().callback();
    }).not.toThrow();
  });

  it('displays a loader', function() {
    initialize();
    instance.showLoader();
    expect(instance.$loader).toBeDefined();
    expect(instance.$loader.get(0).nodeName).toEqual('DIV');
  });

  it('destroys the loader', function() {
    initialize();
    instance.showLoader().hideLoader();
    expect(instance.$loader).toBe(null);
  });

  it('generates the loader with custom HTML', function() {
    initialize({
      loaderHTML: '<span />'
    });
    instance.showLoader();
    expect(instance.$loader.get(0).nodeName).toEqual('SPAN');
  });

  it('adds a custom CSS class to the loader $element', function() {
    initialize({
      loaderClass: 'loader--modifier'
    });
    instance.showLoader();
    expect(instance.$loader).toHaveClass('loader--modifier');
  });

  it('executes a callback before showing the loader', function() {
    var beforeShow = jasmine.createSpy('beforeShow');

    initialize();
    instance.showLoader(null, beforeShow);
    expect(beforeShow).toHaveBeenCalled();
  });

  it('binds the `beforeShow` callback to `this`', function() {
    var beforeShow = jasmine.createSpy('beforeShow').andCallFake(function() {
      this.callback();
    });

    initialize();
    expect(function() {
      instance.showLoader(null, beforeShow);
    }).not.toThrow();
  });

  it('it injects the loader into the specified element', function() {
    var parent;

    initialize();
    instance.showLoader($('<h1 />').appendTo(document.body));

    parent = instance.$loader.get(0).parentNode;
    expect(parent.nodeName).toEqual('H1');
  });

  it('it injects the loader into the `<body>` element', function() {
    initialize();
    instance.showLoader();
    expect(instance.$loader.get(0).parentNode.nodeName).toEqual('BODY');
  });
});