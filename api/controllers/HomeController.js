
module.exports.home = function (req, res) {
  res.ok({
    title: req.__('SITE.TITLE')
  }, 'homepage');
}

module.exports.noLocale = function (req, res) {
  res.redirect(302, '/' + req.locale);
};
