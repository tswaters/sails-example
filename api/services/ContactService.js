
'use strict'

exports.get = (opts, cb) => {
  const userId = opts.user
  const id = opts.id
  Contact.findOne({id, owner: userId}).exec((err, data) => {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err))
    }
    if (!data) {
      return cb(new ExceptionService.NotFound())
    }
    return cb(null, data)
  })
}

exports.list = (opts, cb) => {
  const userId = opts.user
  Contact.find({owner: userId}).exec((err, data) => {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err))
    }
    return cb(null, data)
  })
}

exports.delete = (opts, cb) => {
  Contact.destroy({id: opts.id, owner: opts.user}).exec((err, contacts) => {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err))
    }
    if (contacts.length === 0) {
      return cb(new ExceptionService.NotFound())
    }
    cb(null, null)
  })
}

exports.edit = (opts, cb) => {
  Contact.update({id: opts.id, owner: opts.user}, opts.data).exec((err, contacts) => {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err))
    }
    if (contacts.length === 0) {
      return cb(new ExceptionService.NotFound())
    }
    cb(null, null)
  })
}

exports.create = (data, cb) => {
  Contact.create(data).exec(err => {
    if (err) {
      return cb(new ExceptionService.DatabaseError(err))
    }
    cb(null, null)
  })
}
