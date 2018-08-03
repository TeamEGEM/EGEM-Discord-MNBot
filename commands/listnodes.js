const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var mysql = require('mysql');
const Web3 = require("web3");
// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

var con = mysql.createPool({
  connectionLimit : 25,
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb
});

exports.run = (client, message, args) => {

  if(!message.member.hasPermission('ADMINISTRATOR')){
    return message.channel.send("You cannot use '/adminhelp' command");
  }
  con.getConnection(function(err, connection) {
    connection.query("SELECT * FROM data", function (err, result, fields){
      if (!result) return message.reply("No Results.");
      Object.keys(result).forEach(function(key) {
        var row = result[key];
        message.channel.send(" Name: " + row.userName + " | Address: " + row.address + " | UserID: " + row.userId + " | Status: " + row.isOnline);
      });
      connection.release();
    });
  });

}
