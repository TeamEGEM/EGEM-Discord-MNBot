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

const bot = new Discord.Client({disableEveryone:true});

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provideregem));

exports.run = (client, message, args) => {
  if(!message.member.hasPermission('ADMINISTRATOR')){
    return message.channel.send("You cannot use '/rainall' command");
  }
  var value = args[0];
  if (value == null) {
    return message.reply("Enter an amount.");
  }
  var ifNeg = Math.sign(value);
  if (ifNeg == "-1") {
    return message.reply("You can't rain a negative amount.");
  }
  if(isNaN(value)){
    return message.reply("That is not a valid number.");
  }
  if (value >= 999) {
    return message.reply("You can not rain that much.")
  }
  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query(
      'SELECT COUNT(userId) AS `userCount` FROM `data`',
        function(err, results, fields) {
          var parsed = JSON.stringify(results);
          var obj = JSON.parse(parsed);
          var users = obj[0]['userCount'];
          var rainValue = Number(value / users);
          var rainValueWei = (rainValue*Math.pow(10,18));

          connection.query("SELECT * FROM data", function (err, result, fields){
            if (!result) return message.reply("No Results.");
            let obj = JSON.stringify(result);
            let parsed = JSON.parse(obj);

            let data = result;
            Object.keys(data).forEach(function(key) {
              var row = data[key];
              var address = row.address;
              var userId = row.userId;
              var balance = row.credits;
              var balanceNew = (Number(balance) + Number(rainValueWei));
              connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [balanceNew,row.userId]);

            })
            message.reply("Just rained "+"**"+rainValue+"**"+" EGEM Credits on "+"**"+users+"**"+" in the chat, Enjoy Everyone!")
          })
        }
    );
  })
};
