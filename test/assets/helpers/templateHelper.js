
'use strict'

module.exports = function ($templateCache, $compile, $rootScope, view) {

  let viewHtml = $templateCache.get(view)
  const locals = {
    __ (tag) { return tag }
  }

  if (!viewHtml) {
    const template = $.ajax('base/' + view, {async: false}).responseText
    viewHtml = ejs.render(template, locals)
    $templateCache.put(view, viewHtml)
  }

  const formElement = angular.element(viewHtml)
  $compile(formElement)($rootScope.$new())
  return formElement

}
