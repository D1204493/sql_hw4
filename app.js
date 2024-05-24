var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// 在 express.js 中，使用 sqlite3 來操作數據庫，並開啟位置在 db/sqlite.db 的資料庫，需要確認是否成功打開資料庫
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});


// 撰寫 /api/quotes 路由，使用 SQL 來查詢 gold_prices 所有的資料，回傳 json 格式的資料就好
app.get('/api/quotes', (req, res) => {
    db.all('SELECT * FROM gold_prices', (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.json(rows);
    });
});


// 撰寫 post /api/insert 路由，使用 SQLite 新增一筆黃金資料 (date, product, price)，gold_prices 中，回傳文字的訊息，不要 json
app.post('/api/insert', (req, res) => {
    let date = req.body.date;
    let product = req.body.product;
    let price = req.body.price;
    let sql = 'INSERT INTO gold_prices (date, product, price) VALUES (?, ?, ?)';
    db.run(sql, [date, product, price], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('Insert success');
    });
});


module.exports = app;
