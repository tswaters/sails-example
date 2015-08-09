
require('../../base.js');

describe('HomeController', function () {

  describe('#home', function () {
    it('should render the page', function (next) {
      this.request.get('/').expect(200).end(next);
    });
  });

});
