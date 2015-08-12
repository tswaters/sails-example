
module.exports = function ($templateCache, $compile, $rootScope, view) {

  var viewHtml = $templateCache.get(view);
  var locals = {
    __: function (tag) { return tag; }
  }

  if (!viewHtml) {
    var template = $.ajax('base/' + view, {async: false}).responseText;
    viewHtml = ejs.render(template, locals);
    $templateCache.put(view, viewHtml);
  }

  var formElement = angular.element(viewHtml);
  $compile(formElement)($rootScope.$new());
  return formElement;

};
