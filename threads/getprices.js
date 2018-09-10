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
	console.error("**NODE Price THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);

// Update Node List: Online/Offline and balance
const updatePrice = function queryPrice(){
  try {
    con.getConnection(function(err, connection) {

      try {
        var userBalance = getJSON('https://api.egem.io/api/v1/egem_prices', function(error, response){
          if(!error) {
            var amount = response["AVERAGEUSD"];
            var row = 0;
            //console.log(amount);
            //connection.query(`UPDATE pricedata SET avgusd = ? WHERE id = '0'`, amount);
            connection.query(`UPDATE pricedata SET avgusd = ? WHERE id = ?`, [response["AVERAGEUSD"], row]);
          } else {
            //console.log(error + " | " +row.address+ " | " +row.userName);
          }

        })

        // var balance = web3.eth.getBalance(row.address);
        //connection.query(`UPDATE data SET address = ? WHERE userId = ?`, [address, row.userId]);
        //connection.query(`UPDATE data SET balance = ? WHERE userId = ?`, [amount, row.userId]);
      } catch (e) {
        console.log(e)
      } finally {

      }
      connection.release();
    });
    //let txdata = getNodes();

  console.info("------Price Updating:------");
  } catch (e) {
    console.log(e)
  }

};
setInterval(updatePrice,miscSettings.PriceDelay);

console.error("**NODE Price SYSTEM** is now Online.");
