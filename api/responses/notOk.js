'use strict';

module.exports = function (data) {

  var req = this.req;
  var res = this.res;
  var sails = req._sails;
  if (!(data instanceof ExceptionService.BaseException)) {
    data = new ExceptionService.BaseException(data);
  }

  var status =
   data instanceof ExceptionService.DatabaseError ? 500 :
   data instanceof ExceptionService.NotFound ? 404 :
   data instanceof ExceptionService.Forbidden ? 403 :
   data instanceof ExceptionService.Unauthorized ? 401 :
   data instanceof ExceptionService.BadRequest ? 400 : 500;

  sails.log.info('sending status', status, 'and data', data);

  res.status(status);
  if (sails.config.environment === 'production') {
    delete data.stack;
    delete data.message;
    delete data.type;
  }

  if (req.wantsJSON) {
    return res.json(data);
  }

  res.view(status, data);

};
