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
  connectionLimit : 200,
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
	console.error("**NODE Pinger #2 THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);

// Update Node List: Online/Offline and balance
const updateNodes = function queryNodes(){
  try {
    con.getConnection(function(err, connection) {
      connection.query("SELECT * FROM data", function (err, result, fields){
        if (!result) return message.reply("No Results.");
        let obj = JSON.stringify(result);
        let parsed = JSON.parse(obj);

        let txdata = result;
        Object.keys(txdata).forEach(function(key) {
          var row = txdata[key];
          if (row.shouldCheck2 == "No") {
            return;
          }
          if (row.isOnline2 == "Online" || row.isOnline2 == "Offline") {
            tcpscan.run({'host': row.ip2, 'port': 30666}).then(
              () => {
                var regtx = row.regTxSent;
                con.getConnection(function(err, connection) {
                  connection.query(`UPDATE data SET isOnline2 ="Online" WHERE userId = ?`, row.userId);
                  if (regtx == "Yes" && row.balance >= 40000) {
                    connection.query(`UPDATE data SET canEarn2 ="Yes" WHERE userId = ?`, row.userId);
                  } else {
                    connection.query(`UPDATE data SET canEarn2 ="No" WHERE userId = ?`, row.userId);
                  }
                  console.info("Status: Online. - " + row.userId + " | Node IP #2: " + row.ip2 + " | Can Earn: " + row.canEarn2);
                  connection.release();
                });
              },
              () => {
                con.getConnection(function(err, connection) {
                  connection.query(`UPDATE data SET isOnline2 ="Offline" WHERE userId = ?`, row.userId);
                  connection.query(`UPDATE data SET canEarn2 ="No" WHERE userId = ?`, row.userId);
                  console.error("Status: Offline. - " + row.userId + " | Node IP #2: " + row.ip2 + " | Can Earn: " + row.canEarn2);
                  connection.release();
                });
              }
            );

          }
        });


      });
      connection.release();
    });
    //let txdata = getNodes();

  console.error("------Node #2 Status Updating:------");
  } catch (e) {
    console.log(e)
  }

};
setInterval(updateNodes,miscSettings.NodeDelay3);

console.error("**NODE Pinger #2 SYSTEM** is now Online.");
