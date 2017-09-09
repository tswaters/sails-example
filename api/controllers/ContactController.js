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

exports.get = (req, res) => {
  const id = req.param('id')
  sails.log.info('ContactController#get called with', id)
  ContactService.get({id, user: req.user.id}, (err, contact) => {
    if (err) { return res.notOk(err) }
    res.ok(contact)
  })
}

exports.list = (req, res) => {
  sails.log.info('ContactController#list called')
  ContactService.list({user: req.user.id}, (err, contacts) => {
    if (err) { return res.notOk(err) }
    res.ok(contacts)
  })
}

exports.edit = (req, res) => {
  const id = req.param('id')
  const data = req.body
  sails.log.info('ContactController#edit called for id #', id, ' and ', data)
  ContactService.edit({
    id,
    data,
    user: req.user.id
  }, err => {
    if (err) { return res.notOk(err) }
    res.ok(null, {status: 204})
  })
}

exports.delete = (req, res) => {
  const id = req.param('id')
  sails.log.info('ContactController#delete called for id #', id)
  ContactService.delete({
    id,
    user: req.user.id
  }, err => {
    if (err) { return res.notOk(err) }
    res.ok(null, {status: 204})
  })
}

exports.create = (req, res) => {
  const data = req.body
  data.owner = req.user.id
  sails.log.info('ContactController#create called with ', data)
  ContactService.create(data, err => {
    if (err) { return res.notOk(err) }
    res.ok(null, {status: 204})
  })
}
