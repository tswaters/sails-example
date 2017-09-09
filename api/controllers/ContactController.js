/**
 * ContactController
 *
 * @description :: Server-side logic for managing contacts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

'use strict'

exports.home = (req, res) => {
  sails.log.info('ContactController#home called')
  return res.ok({
    title: req.__('CONTACT-LIST.TITLE')
  }, 'contact/index')
}

exports.get = (req, res, next) => {
  const id = req.param('id')
  const user = req.user.id
  sails.log.info('ContactController#get called for user', user, 'with', id)
  ContactService.get({id, user})
    .then(contact => res.ok(contact))
    .catch(err => next(err))
}

exports.list = (req, res, next) => {
  const user = req.user.id
  sails.log.info('ContactController#list called for user', user)
  ContactService.list({user})
    .then(contacts => res.ok(contacts))
    .catch(err => next(err))
}

exports.edit = (req, res, next) => {
  const id = req.param('id')
  const data = req.body
  const user=  req.user.id
  sails.log.info('ContactController#edit called for ', user, 'with', id, 'and', data)
  ContactService.edit({id, data, user})
    .then(() => res.ok(null, {status: 204}))
    .catch(err => next(err))
}

exports.delete = (req, res, next) => {
  const id = req.param('id')
  const user = req.user.id
  sails.log.info('ContactController#delete called for ', user, 'with', id)
  ContactService.delete({id, user})
    .then(() => res.ok(null, {status: 204}))
    .catch(err => next(err))
}

exports.create = (req, res, next) => {
  const data = req.body
  data.owner = req.user.id
  sails.log.info('ContactController#create called with ', data)
  ContactService.create(data)
    .then(() => res.ok(null, {status: 204}))
    .catch(err => next(err))
}
