'use strict';

module.exports.list = function (cb) {
  Contact.find({}).exec(function (err, data) {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err));
    }
    return cb(null, data);
  });
};

module.exports.delete = function (id, cb) {
  Contact.destroy({id: id}).exec(function (err, contacts) {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err));
    }
    if (contacts.length === 0) {
      return cb(new ExceptionService.NotFound());
    }
    cb(null, null);
  });
};

module.exports.edit = function (id, data, cb) {
  Contact.update({id: id}, data).exec(function (err, contacts) {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err));
    }
    if (contacts.length === 0) {
      return cb(new ExceptionService.NotFound());
    }
    cb(null, null);
  });
};

module.exports.create = function (data, cb) {
  Contact.create(data).exec(function (err) {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err));
    }
    cb(null, null);
  });
};
