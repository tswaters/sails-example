'use strict';

module.exports.list = function (cb) {
  User.find({}).exec(function (err, data) {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err));
    }
    return cb(null, data);
  });
};

module.exports.delete = function (id, cb) {
  User.destroy({id: id}).exec(function (err, users) {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err));
    }
    if (users.length === 0) {
      return cb(new ExceptionService.NotFound());
    }
    cb(null, null);
  });
};

module.exports.edit = function (id, data, cb) {
  User.update({id: id}, data).exec(function (err, users) {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err));
    }
    if (users.length === 0) {
      return cb(new ExceptionService.NotFound());
    }
    cb(null, null);
  });
};

module.exports.create = function (data, cb) {
  User.create(data).exec(function (err) {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err));
    }
    cb(null, null);
  });
};
