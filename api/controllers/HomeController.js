
'use strict'

exports.home = (req, res) => {
  res.ok({
    title: req.__('SITE.TITLE')
  }, 'homepage')
}

exports.noLocale = (req, res) => {
  res.redirect(302, '/' + req.locale)
}
