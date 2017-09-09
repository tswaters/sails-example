
'use strict'

exports.get = opts => {
  const {id, user: owner} = opts
  return Contact.findOne({id, owner})
    .catch(err => { throw new ExceptionService.DatabaseError(err) })
    .then(data => { if (!data) { throw new ExceptionService.NotFound()} return data})
}

exports.list = opts => {
  const {user: owner} = opts
  return Contact.find({owner})
    .catch(err => {throw new ExceptionService.DatabaseError(err)})
}

exports.delete = opts => {
  const {id, user: owner} = opts
  return Contact.destroy({id, owner})
    .catch(err => {
      throw new ExceptionService.DatabaseError(err)
    })
    .then(data => {if (data.length === 0) { throw new ExceptionService.NotFound() }})
}

exports.edit = opts => {
  const {id, user: owner, data} = opts
  return Contact.update({id, owner}, data)
    .catch(err => { throw new ExceptionService.DatabaseError(err) })
    .then(contacts => { if (contacts.length === 0) { throw new ExceptionService.NotFound() }})
}

exports.create = data => {
  return Contact.create(data)
    .catch(err => {throw new ExceptionService.DatabaseError(err)})
}
