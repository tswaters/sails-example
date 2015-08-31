/**
 * ContactController
 *
 * @description :: Server-side logic for managing contacts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

'use strict';

module.exports.home = function (req, res) {
	sails.log.info('ContactController#home called');
	return res.ok({
		'title': req.__('CONTACT-LIST.TITLE')
	}, 'contact/index');
};

module.exports.get = function (req, res) {
	var id = req.param('id');
	sails.log.info('ContactController#get called with', id);
	ContactService.get({id: id, user: req.user.id}, function (err, contact) {
		if (err) { return res.notOk(err); }
		res.ok(contact);
	});
};

module.exports.list = function (req, res) {
	sails.log.info('ContactController#list called');
	ContactService.list({user: req.user.id}, function (err, contacts) {
		if (err) { return res.notOk(err); }
		res.ok(contacts);
	});
};

module.exports.edit = function (req, res) {
	var id = req.param('id');
	var data = req.body;
	sails.log.info('ContactController#edit called for id #', id, ' and ', data);
	ContactService.edit({
		id: id,
		data: data,
		user: req.user.id
	}, function (err) {
		if (err) { return res.notOk(err); }
		res.ok(null, {status: 204});
	});
};

module.exports.delete = function (req, res) {
	var id = req.param('id');
	sails.log.info('ContactController#delete called for id #', id);
	ContactService.delete({
		id: id,
		user: req.user.id
	}, function (err) {
		if (err) { return res.notOk(err); }
		res.ok(null, {status: 204});
	});
};

module.exports.create = function (req, res) {
	var data = req.body;
	data.owner = req.user.id;
	sails.log.info('ContactController#create called with ', data);
	ContactService.create(data, function (err) {
		if (err) { return res.notOk(err); }
		res.ok(null, {status: 204});
	});
};
