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
	console.error("**NODE Users Withdrawal Count THREAD** is ACTIVE");
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

          connection.query(
            'SELECT COUNT(hash) AS `usersCount` FROM `txdatasent` WHERE `to` = ?',
            [row.address],
            function(err, results, fields) {
              var parsed = JSON.stringify(results);
              var obj = JSON.parse(parsed);
              var totalWD = obj[0]['usersCount'];
              //console.log(totalWD);
              connection.query(`UPDATE data SET numberOfWD = ? WHERE address = ?`, [totalWD, row.address]);
            }
          );

        });

      });
      connection.release();
    });

  console.error("------User Withdrawals Updating:------");
  } catch (e) {
    console.log(e)
  }

};
setInterval(updateNodes,miscSettings.WDDelay);

console.error("**NODE Users Withdrawal Count SYSTEM** is now Online.");
