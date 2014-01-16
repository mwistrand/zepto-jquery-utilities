describe('Template Rendering Functions', function() {
  var $div,
    obj = $.extend({}, u$.renderMixin),
    html = '<div data-id="12345">Test contents</div>',
    jsonObj = '{"id": 12345, "text": "Test contents"}',
    jsonArr = '[{"id": 12345,"text": "Test contents"}]',
    template = '<div data-id="{{id}}">{{text}}</div>';

  beforeEach(function() {
    setFixtures(sandbox());
    $div = $('#sandbox');
  });
  afterEach(function() {
    $div.remove();
    $div = null;
  });

  it('renders a JSON array (string) as HTML', function() {
    u$.renderJSON($div, jsonArr, template);
    expect($div.html()).toEqual(html);
  });

  it('renders a JSON object (string) as HTML', function() {
    u$.renderJSON($div, jsonObj, template);
    expect($div.html()).toEqual(html);
  });

  it('renders a plain object of data as HTML', function() {
    var obj = $.parseJSON(jsonObj);

    u$.renderJSON($div, jsonObj, template);
    expect($div.html()).toEqual(html);
  });

  it('returns the updated `$` element', function() {
    var $el = u$.renderJSON($div, jsonObj, template);

    expect($el).toBe($div);
  });

  it('adds a new element to a parent from an array of data', function() {
    u$.render($div, ['<div />', {id: 'test'}]);
    expect($div.html()).toEqual('<div id="test"></div>');
  });

  it('adds a new element to a parent from a string of data', function() {
    u$.render($div, '<div id="test" />');
    expect($div.html()).toEqual('<div id="test"></div>');
  });

  it('appends an element to the end of a parent', function() {
    $div.html(html);
    u$.render($div, ['<div />', {id: 'test'}]);
    expect($div.html()).toEqual(html + '<div id="test"></div>');
  });

  it('prepends an element to the start of a parent', function() {
    $div.html(html);
    u$.render($div, ['<div />', {id: 'test'}], true);
    expect($div.html()).toEqual('<div id="test"></div>' + html);
  });
});