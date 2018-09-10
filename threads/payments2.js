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
require('log-timestamp');

const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
var mysql = require('mysql');

var con = mysql.createPool({
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
	console.log("**PAYMENTS THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);

const payNodes = function sendPay(){
  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
  connection.query("SELECT * FROM data", function (err, result, fields){
    if (!result) return message.reply("No Results.");
    let obj = JSON.stringify(result);
    let parsed = JSON.parse(obj);

    let data = result;
    connection.query("SELECT credits FROM data", function (err, res2, fields){
      if (!result) return message.reply("No Results.");
      let obj3 = JSON.stringify(res2);
      let parsed3 = JSON.parse(obj3);

      connection.query("SELECT * FROM settings", function (err, res, fields){
        if (!result) return message.reply("No Results.");
        let obj2 = JSON.stringify(res);
        let parsed2 = JSON.parse(obj2);
        let basePay = parseInt(res[0]['nodesPayment']);
        let bonusPay = parseInt(res[0]['nodesPaymentBonus']);
        var message = "Enjoy the EGEM.";

        Object.keys(data).forEach(function(key) {
          var row = data[key];
          var address = row.address;
          var userId = row.userId;
          var name = row.userName;
          var hasCheated = row.hasCheated;
          var canEarn = row.canEarn;
          var canEarn2 = row.canEarn2;
          var regTxSent = row.regTxSent;
          var balance = row.credits;
          var nodeBonusPay = row.nodeBonusPay;

          if (canEarn == "Yes" && canEarn2 == "Yes") {
            let pay = (Number(basePay) + Number(bonusPay));
            var weiAmount = (Number(pay) + Number(balance));
            connection.query(`UPDATE data SET myPay =? WHERE userId = ?`, [functions.numberToString(pay),userId]);
            connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [functions.numberToString(weiAmount),userId]);
          }

        })
      })
    })
    connection.release();

  })
})
console.info("**PAYMENTS SENT**");
};
setInterval(payNodes,miscSettings.PayDelay);

console.log("*NODE Payment SYSTEM** is now Online.");
