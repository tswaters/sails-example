
module.exports.home = function (req, res) {
  res.ok({
    title: req.__('SITE.TITLE')
  }, 'homepage');
}
