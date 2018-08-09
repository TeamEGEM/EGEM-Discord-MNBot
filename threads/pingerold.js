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

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

// Thread console heartbeat
const threadHB = function sendHB(){
	console.error("**NODE Pinger THREAD** is ACTIVE");
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
          if (row.shouldCheck == "No") {
            var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + row.address, function(error, response){
              if(!error) {
                let amount = response["BALANCE"];
                connection.query(`UPDATE data SET balance = ? WHERE userId = ?`, [amount, row.userId]);
                //console.log("Balance Updated");
              } else {
                console.log(error);
              }
            })
            return;
          }
          if (row.isOnline == "Online" || row.isOnline == "Offline") {
            tcpscan.run({'host': row.ip, 'port': 30666}).then(
              () => {
                var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + row.address, function(error, response){
                  if(!error) {
                    let amount = response["BALANCE"];
                    var regtx = row.regTxSent;
                    con.getConnection(function(err, connection) {
                      connection.query(`UPDATE data SET balance = ? WHERE userId = ?`, [amount, row.userId]);
                      connection.query(`UPDATE data SET isOnline ="Online" WHERE userId = ?`, row.userId);
                      if (regtx == "Yes") {
                        if (amount >= 15000 || row.betaTester == "Yes") {
                          connection.query(`UPDATE data SET canEarn ="Yes" WHERE userId = ?`, row.userId);
                          connection.release();
                        } else {
                          connection.query(`UPDATE data SET canEarn ="No" WHERE userId = ?`, row.userId);
                          connection.release();
                        }
                      } else {
                        connection.query(`UPDATE data SET canEarn ="No" WHERE userId = ?`, row.userId);
                        connection.release();
                      }
                      console.info("Status: Online. - " + row.userId + " | Node IP: " + row.ip + " | Balance: " + amount + " EGEM." + " | Can Earn: " + row.canEarn);
                    });
                  } else {
                    console.log(error);
                  }
                })
              },
              () => {
                var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + row.address, function(error, response){
                  if(!error) {
                    let amount = response["BALANCE"];
                    con.getConnection(function(err, connection) {
                      connection.query(`UPDATE data SET balance = ? WHERE userId = ?`, [amount, row.userId]);
                      connection.query(`UPDATE data SET isOnline ="Offline" WHERE userId = ?`, row.userId);
                      connection.query(`UPDATE data SET canEarn ="No" WHERE userId = ?`, row.userId);
                      console.error("Status: Offline. - " + row.userId + " | Node IP: " + row.ip + " | Balance: " + amount + " EGEM." + " | Can Earn: " + row.canEarn);
                      connection.release();
                    });
                  } else {
                    console.log(error);
                  }
                })

              }
            );

          }
        });


      });
      connection.release();
    });
    //let txdata = getNodes();

  console.error("------Node Status Updating:------");
  } catch (e) {
    console.log(e)
  }

};
setInterval(updateNodes,miscSettings.NodeDelay);

console.error("**NODE Pinger SYSTEM** is now Online.");
