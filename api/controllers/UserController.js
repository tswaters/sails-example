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
		'title': 'User List'
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
	sails.log.info('UserController#edit called');
	var id = req.param('id');
	var data = req.body;
	UserService.edit(id, data, function (err) {
		if (err) { return res.notOk(err); }
		res.ok(null, {status: 204});
	});
};

module.exports.delete = function (req, res) {
	sails.log.info('UserController#delete called');
	var id = req.param('id');
	UserService.delete(id, function (err) {
		if (err) { return res.notOk(err); }
		res.ok(null, {status: 204});
	});
};

module.exports.create = function (req, res) {
	sails.log.info('UserController#create called');
	var data = req.body;
	UserService.create(data, function (err) {
		if (err) { return res.notOk(err); }
		res.ok(null, {status: 204});
	});
};
