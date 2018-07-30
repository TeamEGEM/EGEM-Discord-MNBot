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
	console.error("**NODE Count THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);

const updateNodes = function upN(){
  pool.getConnection(function(err, connection) {
    pool.query("SELECT COUNT(canEarn) FROM data WHERE canEarn = 'Yes'",function (err, result) {
      let parsed = JSON.stringify(result)
      let obj = JSON.parse(parsed)
      var nodesOnline = obj[0]['COUNT(canEarn)']
      console.info("Node Online: "+nodesOnline)
      pool.query(`UPDATE settings SET nodesOnline =? WHERE id ='1'`, nodesOnline);
      pool.query("SELECT * FROM settings WHERE id = '1'",function (err, res) {
        let parsed2 = JSON.stringify(res)
        let ob2j = JSON.parse(parsed2)
        var payment = ob2j[0]['dailyPayTotal']
        console.log("Daily Total Payment: "+payment)
        var pay = Number(payment);
        var paytime = Number(24);
        var payInterval = Number(4);
        var amountTotal = pay/paytime;
        var amountFinal = amountTotal/payInterval;
        var amount = amountFinal/nodesOnline;
        var total = amount*nodesOnline;
        var weiAmount = amount*Math.pow(10,18);
        console.info("Node Payment: "+amount)
        pool.query(`UPDATE settings SET nodesPayment =? WHERE id ='1'`, functions.numberToString(amount*Math.pow(10,18)));
        connection.release();
      })

    })
  })
};

setInterval(updateNodes,miscSettings.nOnDelay);

console.error("**NODE Count SYSTEM** is now Online.");
