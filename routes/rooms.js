var express = require('express');
var router = express.Router();
var rds=require('../rds');

/* display room list */
router.get('/', function(req, res, next) {
  rds.pool.getConnection(function(err, con){
    if (err) throw err;

    con.query('SELECT * FROM hotel.rooms', function(error, results, fields) {
      con.release();
      if (err) res.send(err);
      if (results) {
        res.render('room-list', { title: 'Room List', url: rds.url, rooms: results});

        console.log('displayed %d rooms', results.length);
      }
    });
  });
});

module.exports = router;
