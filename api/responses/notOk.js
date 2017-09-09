
'use strict'

module.exports = function (data) {

  const req = this.req
  const res = this.res
  const sails = req._sails
  if (!(data instanceof ExceptionService.BaseError)) {
    data = new ExceptionService.BaseError(data)
  }

  res.status(data.status)
  sails.log.info('sending status', data.status, 'and data', data)

  if (sails.config.environment === 'production') {
    delete data.stack
    delete data.message
    delete data.type
  }

  if (req.wantsJSON) {
    return res.json(data)
  }

  res.view(data.status, data)

}
