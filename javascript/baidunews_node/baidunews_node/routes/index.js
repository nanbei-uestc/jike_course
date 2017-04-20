var express = require('express');
var router = express.Router();

var dbconfig = require('./db');
var mysql = require('mysql');

/* getnews */
router.get('/', function(req, res, next) {
    var newstype = req.query.newstype;

    var connection = mysql.createConnection(dbconfig);
    connection.connect();
    connection.query('SELECT * FROM `news`.`news` WHERE `newstype`=?', [newstype], function(err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    });
    connection.end();
});

module.exports = router;
