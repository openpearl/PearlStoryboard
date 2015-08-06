// Dependencies.
var fs = require('fs');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware.
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer settings.
// https://codeforgeek.com/2014/11/file-uploads-using-node-js/
var done = false;
app.use(multer({
  dest: './files/',
  onError: function (error, next) {
    console.log(error);
    next(error);
  },
  onParseStart: function() {
    console.log("On parse start.");
  },
  rename: function (fieldname, filename) {
    return 'input';
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
    done=true;
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/files',  express.static(__dirname + '/files'));

// Routes.
app.get('/', function (req, res) {
  console.log("Beginning route.");
  res.status(200).json({});
});

app.post('/save', function (req, res) {
  var tree = req.body;
  var stringed = JSON.stringify(tree);
  fs.writeFile('./files/input.json', stringed, function (err) {
    if (err) return console.log(err);
    console.log('file saved!');
    res.status(200).end();
  });

  for (var card in tree) {
    delete tree[card].ui;
  }
  var miniStringed = JSON.stringify(tree);
  fs.writeFile('./files/input.min.json', miniStringed, function (err) {
    if (err) return console.log(err);
    console.log("min file saved!");    
  });
});

app.post('/files/processedTree', function (req, res) {
  if (done === true) {
    res.redirect('/');    
  }
});

app.listen(PORT, "0.0.0.0");
