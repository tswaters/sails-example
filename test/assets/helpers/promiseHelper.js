
module.exports = function ($q) {
  return {
    resolve: function (value) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve(value);
        return deferred.promise;
      }
    },
    reject: function (value) {
      return function () {
        var deferred = $q.defer();
        deferred.reject(value);
        return deferred.promise;
      }
    }
  }
}
