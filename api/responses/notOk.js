
'use strict'

module.exports = function (data) {

  const req = this.req
  const res = this.res
  const sails = req._sails

  const response = data instanceof BaseError
    ? data.toJSON(req.locale)
    : {message: data.message, stack: data.stack}

  if (!data.status) { data.status = 500}

  res.statusCode = data.status


  if (sails.config.environment === 'production') {
    delete response.stack
    delete response.type
    delete response.error
  }

  if (req.wantsJSON) {
    res.json(response)
  } else {
    res.view(data.status, {error: response})
  }

  req.log.verbose(res)

}
