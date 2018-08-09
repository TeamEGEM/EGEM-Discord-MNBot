"use strcit";

// Settings and Requires
var getJSON = require('get-json');
var _ = require('lodash');
const Web3 = require("web3");
const Discord = require("discord.js");
const BigNumber = require('bignumber.js');
const fs = require("fs-extra");
const isopen = require("isopen");
const tcpscan = require('simple-tcpscan');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var async = require("async");
var functions = require('../func/main.js');
require('console-color-mr');

const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 25,
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb
});


// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));


// Thread console heartbeat
const threadHB = function sendHB(){
	console.error("**NODE Credit THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);


const updateWD = function upWD(){
  pool.getConnection(function(err, connection) {

    pool.query("SELECT COUNT(betaTester) FROM data WHERE betaTester = 'Yes'",function (err, result2) {
      let parsed2 = JSON.stringify(result2)
      let obj2 = JSON.parse(parsed2)
      var betaTesters = obj2[0]['COUNT(betaTester)']
      console.info("betaTester: "+betaTesters)
      pool.query(`UPDATE settings SET betaTesters =? WHERE id ='1'`, [betaTesters]);
    })
    // pool.query("SELECT * FROM data",function (err, result) {
    //   let data = result;
    //
    //
    //   //console.log(user)
    //   // var sql = 'SELECT COUNT(betaTester) AS "betaTesters" FROM data WHERE to ="Yes"';
    //   // pool.query(sql, function(err, rows) {
    //   //   //if (err) throw err;
    //   //   console.log('Query result: ', rows);
    //   // });
    //   // pool.query(sql,[user],function (err, res) {
    //   //   // if (err) {
    //   //   //   return;
    //   //   // }
    //   //   //let parsed = JSON.stringify(res)
    //   //   //let obj = JSON.parse(parsed)
    //   //   //var totalWD = obj[0]['totalWD']
    //   //   //console.log(res)
    //   //   console.log(res +" | "+ user)
    //   //   //pool.query(`UPDATE data SET numberOfWD =? WHERE id =?`, [totalWD,row.address]);
    //   // })
    //
    //   console.info("Withdrawals Updated")
    //
    //   //pool.query(`UPDATE settings SET totalCredits =? WHERE id ='1'`, functions.numberToString(credits));
    //   connection.release();
    //
    // })
    connection.release();
  })
};



setInterval(updateWD,miscSettings.WDDelay);

console.error("**NODE CountWD SYSTEM** is now Online.");
