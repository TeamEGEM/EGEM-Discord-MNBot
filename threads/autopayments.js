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
  connectionLimit : 100,
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
	console.log("**AUTO WITHDRAWALS THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);

// Main sending function.
function sendCoins(address,value,message,name){
	web3.eth.sendTransaction({
	    from: botSettings.address,
	    to: address,
	    gas: web3.utils.toHex(miscSettings.txgas),
	    value: functions.numberToString(value)
	})
	.on('transactionHash', function(hash){
		// sent pm with their tx
		// recive latest array
		if(name != 1){
      con.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
      connection.query("INSERT INTO txdatasent(`hash`,`to`,`value`) values(?,?,?)",[hash,address,value]);
      console.log("Payment sent: " + hash);
      connection.release();
    });
		} else {
      con.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
      connection.query("INSERT INTO txdatasent(`hash`,`to`,`value`) values(?,?,?)",[hash,address,value]);
      console.log("Payment sent: " + hash);
      connection.release();
    });
		}

	})
	.on('error', console.error);
}

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
          var balance = row.credits;
          var autoWithdrawals = row.autoWithdrawal;
          var minBalance = 5000000000000000000;
          if (autoWithdrawals == "Yes" && balance > minBalance) {
            let balanceSend = (Number(balance) - Number(minBalance));
            console.log(userId + " | Pay: " + balanceSend + " New Balance: " + minBalance);
            let weiAmount = balanceSend;
            sendCoins(address,weiAmount,message,name);
            connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [minBalance,userId]);
          }
        })
      })
    })
  })
  connection.release();
})
console.info("**AUTO WITHDRAWALS SENT**");
};
setInterval(payNodes,miscSettings.AutoPayDelay);

console.log("*NODE Auto Withdrawals SYSTEM** is now Online.");
