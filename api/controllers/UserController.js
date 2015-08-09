/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

'use strict';

module.exports.home = function (req, res) {
	sails.log.info('UserController#home called');
	return res.ok({
		'title': req.__('USER-LIST.TITLE')
	}, 'user/index');
};

module.exports.list = function (req, res) {
	sails.log.info('UserController#list called');
	UserService.list(function (err, users) {
		if (err) { return res.notOk(err); }
		res.ok(users);
	});
};

module.exports.edit = function (req, res) {
	var id = req.param('id');
	var data = req.body;
	sails.log.info('UserController#edit called for id #', id, ' and ', data);
	UserService.edit(id, data, function (err) {
		if (err) { return res.notOk(err); }
		res.ok(null, {status: 204});
	});
};

module.exports.delete = function (req, res) {
	var id = req.param('id');
	sails.log.info('UserController#delete called for id #', id);
	UserService.delete(id, function (err) {
		if (err) { return res.notOk(err); }
		res.ok(null, {status: 204});
	});
};

module.exports.create = function (req, res) {
	var data = req.body;
	sails.log.info('UserController#create called with ', data);
	UserService.create(data, function (err) {
		if (err) { return res.notOk(err); }
		res.ok(null, {status: 204});
	});
};
