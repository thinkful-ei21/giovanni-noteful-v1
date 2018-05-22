'use strict';

const morgan = require('morgan');

const logger = morgan(':date[iso] :method :url');


module.exports.logger = logger