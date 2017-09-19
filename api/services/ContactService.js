
'use strict'

const uuid = require('uuid')

exports.get = opts => {
  const {id, owner} = opts
  return Contact.findOne({id, owner})
    .catch(err => { throw new DatabaseError(err) })
    .then(data => {
      if (!data) { throw new NotFound('CONTACT-NOT-FOUND')}
      return data
    })
}

exports.list = opts => {
  const {owner} = opts
  return Contact.find({owner}, ['name', 'uuid'])
    .catch(err => {throw new DatabaseError(err)})
}

exports.delete = opts => {
  const {id, owner} = opts
  return Contact.destroy({id, owner})
    .catch(err => {
      throw new DatabaseError(err)
    })
    .then(data => {
      if (data.length === 0) { throw new NotFound('CONTACT-NOT-FOUND') }
    })
}

exports.edit = opts => {
  const {id, owner, name} = opts
  return Contact.update({id, owner}, {name})
    .catch(err => {
      throw new DatabaseError(err)
    })
    .then(contacts => {
      if (contacts.length === 0) { throw new NotFound('CONTACT-NOT-FOUND') }
    })
}

exports.create = opts => {
  const {name, owner} = opts
  const id = uuid.v4()
  return Contact.create({id, owner, name})
    .catch(err => {throw new DatabaseError(err)})
}
