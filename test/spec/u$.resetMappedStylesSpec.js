describe('u$.resetMappedStyles', function() {
  var $div,
    styles;
  
  beforeEach(function() {
    setFixtures(sandbox());
    $div = $('#sandbox').css({
      margin: '20px auto'
    });
    styles = u$.resetMappedStyles($div, {
      marginTop: '30px',
      marginRight: '10px'
    }, function($el) {
      var el = $el.get(0);
      
      return {
        marginTop: el.style.marginTop,
        marginRight: el.style.marginRight
      };
    });
  });
  afterEach(function() {
    $div.remove();
    styles = null;
  });
  
  it('sets the styles on an element', function() {
    var div = $div.get(0);
    
    expect(div.style['margin-top']).toEqual('20px');
    expect(div.style['margin-right']).toEqual('auto');
  });
  
  it('resets the styles to what they were', function() {
    expect(styles['marginTop']).toEqual('30px');
    expect(styles['marginRight']).toEqual('10px');
  });
});