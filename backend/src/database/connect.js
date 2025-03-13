"use strict";
const fs = require("fs");
const pg = require("pg");

const config = {
    connectionString:
        "postgres://crypto_user:12345678@rc1a-t7f81haivb6910fy.mdb.yandexcloud.net:6432/crypto_db",
    ssl: {
        rejectUnauthorized: true,
        ca: fs
            .readFileSync("/Users/spoon//.postgresql/root.crt") // Укажите правильный путь к сертификату
            .toString(),
    },
};

const conn = new pg.Client(config);

conn.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
});

conn.query("SELECT version()", (err, q) => {
    if (err) throw err;
    console.log(q.rows[0]);
    conn.end();
});