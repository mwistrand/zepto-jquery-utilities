window.u$ || (window.u$ = {});

u$.getStyles = function($el, props, callback) {
  var old = {},
    el = $el.get(0);
  
  $.each(props, function(name, value) {
    // $.fn.css will change 'auto' to '0px', which is not what
    // we want. So we'll access the underlying element directly.
    old[name] = el.style[name];
    
    if (callback) {
      callback($el, name, value);
    }
  });
  
  return old;
};