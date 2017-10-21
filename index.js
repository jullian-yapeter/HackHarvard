const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const gunDetection = require('./gunDetection');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/annotate', gunDetection.getLabels);

app.listen(1337, function() {
  console.log('Example app listening on port 3000!');
});
