'use strict';

module.exports.list = function (opts, cb) {
  var userId = opts.user;
  Contact.find({owner: userId}).exec(function (err, data) {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err));
    }
    return cb(null, data);
  });
};

module.exports.delete = function (opts, cb) {
  Contact.destroy({id: opts.id, owner: opts.user}).exec(function (err, contacts) {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err));
    }
    if (contacts.length === 0) {
      return cb(new ExceptionService.NotFound());
    }
    cb(null, null);
  });
};

module.exports.edit = function (opts, cb) {
  Contact.update({id: opts.id, owner: opts.user}, opts.data).exec(function (err, contacts) {
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
