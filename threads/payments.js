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

// Update Node List: Online/Offline and balance
function getNodes(){ return JSON.parse(fs.readFileSync('./data/nodes.txt'));}
// List of functions needed.
// -register (done)
// -check reg (done)
// -listnodes (done)
// -update online/offline (done)
// -check if online more than X amount of time and has X balance.
// -keep track of payments / return payment stats based on registered nodes.
// -find a way to export data for extra stats/functions.
// -increment balance owed
// -calculate users balance
// -send coins

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));


// Thread console heartbeat
const threadHB = function sendHB(){
	console.log("**PAYMENTS THREAD** is ACTIVE");
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
      console.log("Payment sent: " + hash);
		} else {
      console.log("Payment sent: " + hash);
		}

	})
	.on('error', console.error);
}

const payNodes = function sendPay(){
  var data = getNodes();
  var message = "Enjoy the EGEM.";
  var rowCount = Number(data.length);
  var pay = Number(1000);
  var paytime = Number(24);
  var payInterval = Number(4);
  var amountTotal = pay/paytime;
  var amountFinal = amountTotal/payInterval;
  var amount = amountFinal/rowCount;
  var total = amount*rowCount;
  var weiAmount = amount*Math.pow(10,18);
  Object.keys(data).forEach(function(key) {
    var row = data[key];
    var address = row.address;
    var name = row.userName;
    var hasCheated = row.hasCheated;
    var canEarn = row.canEarn;
    var regTxSent = row.regTxSent;
    if (hasCheated == "Yes" || canEarn == "No" || regTxSent == "No") {
        console.log("No payment for user.");
        return;
    }
    sendCoins(address,weiAmount,message,name);
  })
  console.log(rowCount + " | " + amount + " | " + total);
  //console.log("**PAYMENTS SENT**");
};
setInterval(payNodes,miscSettings.PayDelay);

console.log("*PAYMENTS SYSTEM** is now Online.");
