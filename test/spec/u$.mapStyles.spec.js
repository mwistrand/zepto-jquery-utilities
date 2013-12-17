describe('u$.mapStyles', function() {
  var $div,
    styles;
  
  beforeEach(function() {
    setFixtures(sandbox());
    $div = $('#sandbox').css({
      margin: '20px auto'
    });
    styles = u$.mapStyles($div, {
      marginTop: '30px',
      marginRight: '10px'
    });
  });
  afterEach(function() {
    $div.remove();
    styles = null;
  });
  
  it('sets the styles on an element', function() {
    expect($div.css('margin-top')).toEqual('30px');
    expect($div.css('margin-right')).toEqual('10px');
  });
  
  it('returns an object with old styles', function() {
    expect(styles.marginTop).toEqual('20px');
    expect(styles.marginRight).toEqual('0px');
  });
});