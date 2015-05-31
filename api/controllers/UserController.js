/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

'use strict';

module.exports = {

	'list': function (req, res) {
		User.find({}).exec(function (err, result) {
			if (err) { return res.serverError(err); }
			return res.ok({title: 'User List', users: result}, {view: 'user/list'});
		});
	},

	'delete': function (req, res) {
		var id = req.param('id');
		if (!id) { return res.badRequest('id was not provided'); }
		switch (req.method) {
			case 'GET':
				User.findOne({id: id}).exec(function (err, user) {
					if (err) { return res.serverError(err); }
					if (!user) { return res.notFound('User not found'); }
					return res.ok({ title: 'Delete user #' + user.id, user: user}, {view: 'user/delete'});
				});
				break;
			case 'POST':
				User.destroy({id: id}).exec(function (err) {
					if (err) { return res.serverError(err); }
					res.ok(null, {status: 204});
				});
				break;
		}
	},

	'edit': function (req, res) {
		var id = req.param('id');
		if (!id) { return res.badRequest('id was not provided'); }
		switch (req.method) {
			case 'GET':
				User.findOne({id: id}).exec(function (err, user) {
					if (err) { return res.serverError(err); }
					if (!user) { return res.notFound('User not found'); }
					return res.ok({ title: 'Edit user #' + user.id, user: user}, {view: 'user/edit'});
				});
				break;
			case 'POST':
				User.update({id: req.param('id')}, req.body).exec(function (err) {
					if (err) { return res.serverError(err); }
					res.redirect('/user');
				});
				break;
		}
	},

	'create': function (req, res) {
		switch (req.method) {
			case 'GET':
				res.ok({title: 'Create user'}, { view: 'user/create'});
				break;
			case 'POST':
				if (!req.body.name) { return res.badRequest('Name not provided.'); }
				User.create(req.body).exec(function (err) {
					if (err) { return res.serverError(err); }
					res.redirect('/user');
				});
				break;
		}
	}

};
