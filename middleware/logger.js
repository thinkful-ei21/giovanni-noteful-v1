'use strict';

const morgan = require('morgan');

const logger = morgan('dev');


module.exports.logger = logger