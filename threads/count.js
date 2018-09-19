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
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provideregem));

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
      var nodesOnline1 = obj[0]['COUNT(canEarn)']
      console.info("Node #1 Online: "+nodesOnline1)
      pool.query("SELECT COUNT(canEarn2) FROM data WHERE canEarn2 = 'Yes'",function (err, result2) {
        let parsed2 = JSON.stringify(result2)
        let obj2 = JSON.parse(parsed2)
        var nodesOnline2 = obj2[0]['COUNT(canEarn2)']
        console.info("Node #2 Online: "+nodesOnline2)
        var nodesOnlineTotal = (Number(nodesOnline1) + Number(nodesOnline2))
        console.info("Nodes Online: "+nodesOnlineTotal)
      pool.query(`UPDATE settings SET nodesOnline =? WHERE id ='1'`, nodesOnline1);
      pool.query(`UPDATE settings SET nodesOnline2 =? WHERE id ='1'`, nodesOnline2);
      pool.query("SELECT * FROM settings WHERE id = '1'",function (err, res) {
        let parsed2 = JSON.stringify(res)
        let ob2j = JSON.parse(parsed2)
        var payment = ob2j[0]['dailyPayTotal']
        var bonusPay = ob2j[0]['dailyPayBonusTotal']
        console.log("Daily Primary Payment: "+payment)
        console.log("Daily Secondary Payment: "+bonusPay)
        var pay = Number(payment);
        var bonus = Number(bonusPay)
        var paytime = Number(24);
        var payInterval = Number(4);
        var amountTotal = pay/paytime;
        var amountFinal = amountTotal/payInterval;
        var bonusTotal = bonus/paytime;
        var bonusFinal = bonusTotal/payInterval;
        var amount = amountFinal/nodesOnline1;
        var amount2 = bonusFinal/nodesOnline2;
        var total = amount*nodesOnline1;
        var weiAmount = amount*Math.pow(10,18);
        console.info("Node Payment: "+amount)
        console.info("Beta Node Payment: "+Number(amount*3))
        pool.query(`UPDATE settings SET nodesPayment =? WHERE id ='1'`, functions.numberToString(amount*Math.pow(10,18)));
        pool.query(`UPDATE settings SET nodesPaymentBonus =? WHERE id ='1'`, functions.numberToString(amount2*Math.pow(10,18)));
        pool.query("SELECT SUM(value) AS totalWithdrawn FROM txdatasent", function (err, res2) {
          if (err) return message.reply("No Results.");
          var parsed3 = JSON.stringify(res2);
          var obj3 = JSON.parse(parsed3);
          var totalWithdrawn = obj3[0]['totalWithdrawn'];
          console.info("Total EGEM Withdrawn: "+functions.numberToString(totalWithdrawn))
          pool.query(`UPDATE settings SET totalWithdrawn =? WHERE id ='1'`, functions.numberToString(totalWithdrawn));
          pool.query("SELECT SUM(balance) AS totalLocked FROM data WHERE canEarn = 'Yes'", function (err, res3) {
            if (err) return message.reply("No Results.");
            var parsed4 = JSON.stringify(res3);
            var obj4 = JSON.parse(parsed4);
            var totalLocked = obj4[0]['totalLocked'];
            console.info("Est EGEM Locked: "+totalLocked)
            pool.query(`UPDATE settings SET totalLocked =? WHERE id ='1'`, totalLocked);
            pool.query("SELECT SUM(myPay) AS totalPay FROM data WHERE canEarn = 'Yes'", function (err, res4) {
              if (err) return message.reply("No Results.");
              var parsed5 = JSON.stringify(res4);
              var obj5 = JSON.parse(parsed5);
              var totalPay = obj5[0]['totalPay'];
              var totalPayEgem = Number(totalPay/Math.pow(10,18));
              console.info("Total Pay Per 15/min: "+ totalPayEgem)
              pool.query(`UPDATE settings SET totalPay15 =? WHERE id ='1'`, totalPay);
              pool.query("SELECT SUM(value) AS totalDeposits FROM txdata", function (err, res5) {
                if (err) return message.reply("No Results.");
                var parsed6 = JSON.stringify(res5);
                var obj6 = JSON.parse(parsed6);
                var totalDeposits = obj6[0]['totalDeposits'];
                //var totalPayEgem = Number(totalPay/Math.pow(10,18));
                console.info("Total Deposited: "+ functions.numberToString(totalDeposits))
                pool.query(`UPDATE settings SET totalDeposits =? WHERE id ='1'`, functions.numberToString(totalDeposits));
                pool.query("SELECT COUNT(hash) AS totalWD FROM txdatasent", function (err, res6) {
                  if (err) return message.reply("No Results.");
                  var parsed7 = JSON.stringify(res6);
                  var obj7 = JSON.parse(parsed7);
                  var totalWD = obj7[0]['totalWD'];
                  //var totalPayEgem = Number(totalPay/Math.pow(10,18));
                  console.info("Total Withdrawals: "+ totalWD)
                  pool.query(`UPDATE settings SET totalWithdrawals =? WHERE id ='1'`, totalWD);
                  pool.query("SELECT COUNT(hash) AS totalDepositCount FROM txdata", function (err, res7) {
                    if (err) return message.reply("No Results.");
                    var parsed8 = JSON.stringify(res7);
                    var obj8 = JSON.parse(parsed8);
                    var totalDepositCount = obj8[0]['totalDepositCount'];
                    //var totalPayEgem = Number(totalPay/Math.pow(10,18));
                    console.info("Total Deposits: "+ totalDepositCount)
                    pool.query(`UPDATE settings SET totalDepositCount =? WHERE id ='1'`, totalDepositCount);

                  })
                })
              })
            })
          })
        })
        connection.release();
      })
    })
    })
  })

};

setInterval(updateNodes,miscSettings.CountDelay);

console.error("**NODE Count SYSTEM** is now Online.");
