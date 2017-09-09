
'use strict'

module.exports = function ($q) {
  return {
    resolve (value) {
      return function () {
        const deferred = $q.defer()
        deferred.resolve(value)
        return deferred.promise
      }
    },
    reject (value) {
      return function () {
        const deferred = $q.defer()
        deferred.reject(value)
        return deferred.promise
      }
    }
  }
}
