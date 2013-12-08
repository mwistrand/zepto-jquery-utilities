window.u$ || (window.u$ = {});

u$.height = (function() {
  var props = {
    display: 'block',
    position: 'absolute',
    visibility: 'hidden',
    paddingTop: 0,
    paddingBottom: 0
  };
  
  return function($el) {
    return u$.resetMappedStyles($el, props, function($el) {
      return $el[0].clientHeight;
    });
  };
})();