const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const cors = require('cors');
const app = express();

app.use(cors());
cors({ credentials: true, origin: true });
app.use(bodyParser.json());
app.use('/', router);
let server = app.listen('1230', function (req, res) {
  console.log('Server started at port 1230');
});
module.exports = server;
