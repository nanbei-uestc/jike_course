var express = require('express');
var router = express.Router();

var dbconfig = require('./db');
var mysql = require('mysql');
var pool = mysql.createPool(dbconfig);

/*刷新新闻列表*/
router.get('/getnews', function(req, res, next) {
    pool.query('SELECT * FROM `news`.`news`', function(err, rows, fields) {
        if (err) throw err;
        res.json(rows);
    })
});

/*添加新闻*/
router.post("/insert", function(req, res, next) {
    var newstype = req.body.newstype;
    var newsimg = req.body.newsimg;
    var newstitle = req.body.newstitle;
    var newstime = req.body.newstime;
    var newssrc = req.body.newssrc;

    pool.query('INSERT INTO `news`.`news` (`id`, `newstype`, `newsimg`, `newstitle`, `newstime`, `newssrc`) VALUES (NULL, ?,?,?,?,?)', [newstype, newsimg, newstitle, newstime, newssrc],
        function(err, results, fields) {
            if (err) throw err;
            console.log(results.insertId);
            res.json({ "insert": "ok" });
        })

});

/*删除新闻*/
router.post('/delete', function(req, res, next) {
    var newsid = req.body.newsid;

    pool.query('DELETE FROM `news`.`news` WHERE `id`=?', [newsid], function(err, results, fields) {
        if (err) throw err;
        console.log(results.affectedRows);

        res.json({ "delete": "ok" });
    })
});

/*编辑新闻*/
router.get('/curnews', function(req, res, next) {
    var newsid = req.query.newsid;

    pool.query('SELECT * FROM `news`.`news` WHERE `id`=?', [newsid], function(err, results, fields) {
        if (err) throw err;
        res.json(results);
    })

});
router.post('/update', function(req, res, next) {
    var newstype = req.body.newstype;
    var newsimg = req.body.newsimg;
    var newstitle = req.body.newstitle;
    var newstime = req.body.newstime;
    var newssrc = req.body.newssrc;
    var newsid = req.body.newsid;

    pool.query('UPDATE `news`.`news` SET `newstype`=?,`newsimg`=?,`newstitle`=?,`newstime`=?,`newssrc`=? WHERE `id`=?', [newstype, newsimg, newstitle, newstime, newssrc, newsid], function(err, results, fields) {
        if (err) throw err;
        console.log(results.changedRows);
        res.json({ "update": "ok" });
    })
});


module.exports = router;
