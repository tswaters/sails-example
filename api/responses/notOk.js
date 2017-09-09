
'use strict'

module.exports = function (data) {

  const req = this.req
  const res = this.res
  const sails = req._sails
  if (!(data instanceof ExceptionService.BaseError)) {
    data = new ExceptionService.BaseError(data)
  }

  const response = data.toJSON(req.locale)
  res.status(data.status)

  sails.log.info('sending status', data.status, 'for error code: ', data.error, data.replacements)

  if (sails.config.environment === 'production') {
    delete response.stack
    delete response.type
  }

  if (req.wantsJSON) {
    return res.json(response)
  }

  res.view(data.status, {error: response})

}
