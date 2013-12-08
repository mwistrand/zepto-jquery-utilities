window.u$ || (window.u$ = {});

u$.mapStyles = (function() {
  function setStyle($el, name, value) {
    $el.css(name, value);
  }
  
  return function($el, props) {
    return u$.getStyles($el, props, setStyle);
  };
})();