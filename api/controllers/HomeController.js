
'use strict'

exports.home = (req, res) => {
  req.log.info('HomeController called')
  res.ok({
    title: req.__('SITE.TITLE')
  }, 'homepage')
}

exports.noLocale = (req, res) => {
  res.redirect(302, '/' + req.locale)
}
