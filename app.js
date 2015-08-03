
process.chdir(__dirname);

require('sails').lift(require('./sails.config')());
