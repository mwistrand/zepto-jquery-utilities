window.u$ || (window.u$ = {});

u$.getNumericStyles = (function() {
  var directions = 'top,right,bottom,left'.split(',');
  
  function testStyle(style) {
    return !isNaN(parseInt(style, 10));
  }
  
  function setStyle($el, name, styles) {
    var style = $el.get(0).style[name];
    
    if (testStyle(style)) {
      styles[name] = style;
    }
    
    return style;
  }
  
  return function($el, styles) {
    var props = [].slice.call(arguments, 2);
    
    $.each(props, function(i, name) {
      if (testStyle($el.css(name + '-top'))) {
        $.each(directions, function(i, dir) {
          setStyle($el, name + '-' + dir, styles);
        });
      } else {
        setStyle($el, name, styles);
      }
    });
    
    return styles;
  };
})();