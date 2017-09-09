
'use strict'

module.exports = (req, res, next) => {
  const lang = req.param('lang') || sails.config.i18n.defaultLocale
  if (sails.config.i18n.locales.indexOf(lang) === -1) {
    return res.notOk(new ExceptionService.BadRequest('invalid locale'))
  }
  req.locale = res.locale = sails.__ = lang
  next()
}
