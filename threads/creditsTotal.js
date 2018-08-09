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
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));


// Thread console heartbeat
const threadHB = function sendHB(){
	console.error("**NODE Credit THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);


const updateNodes = function upN(){
  pool.getConnection(function(err, connection) {
    pool.query("SELECT SUM(credits) AS 'credits' FROM data",function (err, result) {
      let parsed = JSON.stringify(result)
      let obj = JSON.parse(parsed)
      var credits = obj[0]['credits']
      console.info("Total Credits Updated")
      pool.query(`UPDATE settings SET totalCredits =? WHERE id ='1'`, functions.numberToString(credits));
      connection.release();

    })
    connection.release();
  })
};



setInterval(updateNodes,miscSettings.nOnDelay);

console.error("**NODE Credit SYSTEM** is now Online.");
