/**
 * ContactController
 *
 * @description :: Server-side logic for managing contacts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

'use strict'

exports.home = (req, res) => {
  req.log.info('ContactController#home called')
  return res.ok({
    title: req.__('CONTACT-LIST.TITLE')
  }, 'contact/index')
}

exports.get = (req, res, next) => {
  const id = req.param('id')
  const owner = res.locals.user.uuid
  req.log.info('ContactController#get called for user', owner, 'with', id)
  ContactService.get({id, owner})
    .then(contact => res.ok(contact))
    .catch(err => next(err))
}

exports.list = (req, res, next) => {
  const owner = res.locals.user.uuid
  req.log.info('ContactController#list called for user', owner)
  ContactService.list({owner})
    .then(contacts => res.ok(contacts))
    .catch(err => next(err))
}

exports.edit = (req, res, next) => {
  const id = req.param('id')
  const {name} = req.body
  const owner = res.locals.user.uuid
  req.log.info('ContactController#edit called for', owner, 'with', id, 'and', name)

  if (!name) {
    return next(new BadRequest('INVALID-NAME'))
  }

  ContactService.edit({id, name, owner})
    .then(() => res.ok(null, {status: 204}))
    .catch(err => next(err))
}

exports.delete = (req, res, next) => {
  const id = req.param('id')
  const owner = res.locals.user.uuid
  req.log.info('ContactController#delete called for', owner, 'with', id)
  ContactService.delete({id, owner})
    .then(() => res.ok(null, {status: 204}))
    .catch(err => next(err))
}

exports.create = (req, res, next) => {
  const owner = res.locals.user.uuid
  const {name} = req.body

  req.log.info('ContactController#create called with', owner, 'and', name)

  if (!name) {
    return next(new BadRequest('INVALID-NAME'))
  }

  ContactService.create({owner, name})
    .then(() => res.ok(null, {status: 204}))
    .catch(err => next(err))
}
