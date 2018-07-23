const Web3 = require("web3");
const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var mysql = require('mysql');
var functions = require('../func/main.js');
var con = mysql.createPool({
  connectionLimit : 25,
  host: "localhost",
  user: "root",
  password: botSettings.mysqlpass,
  database: "EGEMTest"
});

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

exports.run = (client, message, args) => {
  var user = message.author.username;
  var author = message.author.id;

  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
      if (err) return message.reply("No Results.");
      try {
        let parsed = JSON.stringify(result);
        let obj = JSON.parse(parsed);
        let authorCheck = obj[0]["userId"];
        let amount = obj[0]["balance"];
        if (authorCheck == author) {
          if (author == authorCheck) {
            connection.release();
            console.log(obj);
            return message.reply("you have " + amount + " EGEM (Rounded Balance)");
          }
        }
      }catch(e){
        console.log("ERROR ::",e)
        connection.release();
        return message.reply("Not registered.");
      }
    })
  })
}
