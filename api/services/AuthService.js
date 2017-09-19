/**
 * Auth Service
 *
 * @description
 * Handles db interactions for authentication/login/register
 */
'use strict'

const uuid = require('uuid')

exports.logout = async key => {
  await LoginToken.destroy(key)
}

exports.authenticate = async key => {

  if (!key) { return null }

  const loginToken = await LoginToken.findOne(key)
  if (!loginToken) { throw new Unauthorized('TOKEN-INVALID') }

  const user = await User.findOne(loginToken.user)
  if (!user) { throw new Unauthorized('USER-NOT-FOUND') }

  return user
}

exports.login = async (username, password) => {

  const user = await User.verify({username, password})
  await LoginToken.destroy({user: user.uuid}) // kill previous tokens

  const loginToken = await LoginToken.create({key: uuid.v4(), user: user.uuid})
  return loginToken.key
}

exports.register = async (username, password) => {

  const existingUser = await User.findOne({username})
  if (existingUser) { throw new BadRequest('USER-ALREADY-EXISTS')}

  await User.create({uuid: uuid.v4(), username, password})
  return await exports.login(username, password)
}
