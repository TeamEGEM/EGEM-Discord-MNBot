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
    connection.query("SELECT * FROM data", function (err, result, fields){
      if (!result) return message.reply("No Results.");
      let obj = JSON.stringify(result);
      let parsed = JSON.parse(obj);
      let userdata = result;
      function delay() {
      	return new Promise(resolve => setTimeout(resolve, 10));
      }

      async function delayedLog(item) {
      	// await promise return
      	await delay();
      	// log after delay
        if (item.ip != "192.168.6.66") {
          //console.log(" | IP Address: " + item.ip);
          if (item.shouldCheck2 == "No") {
            return;
          }
          if (item.isOnline2 == "Online" || item.isOnline2 == "Offline") {
            tcpscan.run({'host': item.ip2, 'port': 30666}).then(
              () => {
                var regtx = item.regTxSent;
                con.getConnection(function(err, connection) {
                  connection.query(`UPDATE data SET isOnline2 ="Online" WHERE userId = ?`, item.userId);
                  if (regtx == "Yes" && item.balance >= 40000) {
                    connection.query(`UPDATE data SET canEarn2 ="Yes" WHERE userId = ?`, item.userId);
                  } else {
                    connection.query(`UPDATE data SET canEarn2 ="No" WHERE userId = ?`, item.userId);
                  }
                  //console.info("Status: Online. - " + item.userId + " | Node IP #2: " + item.ip2 + " | Can Earn 2: " + item.canEarn2 + " | Balance " + item.balance);
                  connection.release();
                });

              },
              () => {
                con.getConnection(function(err, connection) {
                  connection.query(`UPDATE data SET isOnline2 ="Offline" WHERE userId = ?`, item.userId);
                  connection.query(`UPDATE data SET canEarn2 ="No" WHERE userId = ?`, item.userId);
                  //console.error("Status: Offline. - " + item.userId + " | Node IP #2: " + item.ip2 + " | Can Earn 2: " + item.canEarn2 + " | Balance " + item.balance);
                  connection.release();
                });
              }
            );

          }
        }
      }

      async function processArray(array) {
      	for (const item of array) {
      		await delayedLog(item);
      	}
      	console.log("Pinger #2 Done");
      }
      processArray(userdata);
    });
    connection.release();
});
};
setInterval(updateNodes,120000);

console.error("**NODE Pinger #2 SYSTEM** is now Online.");
