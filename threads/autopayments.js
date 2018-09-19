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
  connectionLimit : 200,
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
      let userdata = result;
      function delay() {
      	return new Promise(resolve => setTimeout(resolve, 30));
      }
      async function delayedLog(item) {
      	// await promise return
      	await delay();
      	// log/execute after delay
        var address = item.address;
        var userId = item.userId;
        var name = item.userName;
        var balance = Number(item.credits);
        var autoWithdrawals = item.autoWithdrawal;
        var minBalance = Number(item.minBalance);
        var autoFee = 100000000000000000;
        var baseBalance = 0;
        var message = "Enjoy the EGEM.";
        if (autoWithdrawals == "Yes" && balance > minBalance) {
          console.log(userId + " | Paid " + functions.numberToString(balance) + " | Min Bal: " + minBalance);
          let weiAmount = (Number(balance) - Number(autoFee));
          sendCoins(address,weiAmount,message,name);
          connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [baseBalance,userId]);
        }
      }
      async function processArray(array) {
      	for (const item of array) {
      		await delayedLog(item);
      	}
      	console.log("Done");
      }
      processArray(userdata);
    })
  connection.release();
})

console.info("**AUTO WITHDRAWALS SENT**");
};
setInterval(payNodes,300000);

console.log("*NODE Auto Withdrawals SYSTEM** is now Online.");
