window.u$ || (window.u$ = {});

u$.resetMappedStyles = function($el, props, fn) {
  var old = u$.mapStyles($el, props),
    retValue = fn($el);
  
  $.each(old, function(name, value) {
    $el.css(name, value);
  });
  
  return retValue;
};