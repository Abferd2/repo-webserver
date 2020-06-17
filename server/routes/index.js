const express = require('express');
const app = express();

require('./login');
require('./usuario');

app.use(require('./login'));
app.use(require('./usuario'));

module.exports = app;