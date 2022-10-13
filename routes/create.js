var express = require('express');
var router = express.Router();
var rds = require('../rds');

router.get('/', function(req, res, next) {
  const [pool, rdsUrl] = rds();
  pool.getConnection(function(err, con){
    if (err) throw err;

    console.log("Create table in database if not exists!");

    con.query('CREATE DATABASE IF NOT EXISTS hotel;', function(error, result, fields) {
      if (err) throw err;
      console.log(result);
    });

    con.query('USE hotel;', function(error, result, fields) {
      if (err) throw err;
      console.log(result);
    });

    con.query('CREATE TABLE IF NOT EXISTS rooms(id int NOT NULL, floor int, hasView boolean, occupied boolean, comment varchar(60), PRIMARY KEY(id));', function(error, result, fields) {
      if (err) throw err;
      console.log(result);
    });

    con.release();
  });

  res.render('create', { url: rdsUrl });
});

module.exports = router;
