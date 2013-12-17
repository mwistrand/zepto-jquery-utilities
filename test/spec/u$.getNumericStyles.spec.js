describe('u$.getNumericStyles', function() {
  var $div;
  
  beforeEach(function() {
    setFixtures(sandbox());
    $div = $('#sandbox');
  });
  afterEach(function() {
    $div.remove();
  });

  it('returns an object with numeric styles', function() {
    var styles;

    $div.css({
      margin: '20px auto'
    });

    styles = u$.getNumericStyles($div, {}, 'margin');
    expect(styles['margin-top']).toBeDefined();
    expect(styles['margin-top']).toEqual('20px');
    expect(styles['margin-left']).toEqual('0px');
  });
});