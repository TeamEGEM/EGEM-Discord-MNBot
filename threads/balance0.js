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

var con = mysql.createPool({
  connectionLimit : 25,
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb
});
const prefix = miscSettings.prefix;
const bot = new Discord.Client({disableEveryone:true});

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provideregem));

// Thread console heartbeat
const threadHB = function sendHB(){
	console.error("**NODE Balance THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);

// Update Node List: Online/Offline and balance
const updateNodes = async function queryNodes(){

con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT address FROM data", function (err, result, fields){
      if (!result) return message.reply("No Results.");
      let obj = JSON.stringify(result);
      let parsed = JSON.parse(obj);
      let userdata = result;

      function delay() {
      	return new Promise(resolve => setTimeout(resolve, 100));
      }

      async function delayedLog(item) {
      	// await promise return
      	await delay();
      	// log after delay
        var getbal = await web3.eth.getBalance(item.address);
        var finbal = Number(getbal/Math.pow(10,18));
      	console.log(finbal + " | Address: " + item.address);
        connection.query(`UPDATE data SET balance =? WHERE address = ?`, [finbal,item.address]);
      }

      async function processArray(array) {
      	for (const item of array) {
      		await delayedLog(item);
      	}
      	console.log("Done");
      }
      processArray(userdata);
    });
});
};
setInterval(updateNodes,miscSettings.BalanceDelay);

console.error("**NODE Balance SYSTEM** is now Online.");
