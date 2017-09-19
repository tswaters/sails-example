
'use strict'

module.exports = (req, res, next) => {
  const lang = req.param('lang') || sails.config.i18n.defaultLocale
  if (sails.config.i18n.locales.indexOf(lang) === -1) {
    return next(new BadRequest('INVALID-LOCALE'))
  }
  req.locale = res.locale = lang
  next()
}
