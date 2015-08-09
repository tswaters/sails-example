
require('../../base.js');

describe('localize policy', function () {

  it('should return 400 if bad locale is provided', function (next) {
    this.request.get('/zz/').expect(400).end(next);
  });

});
