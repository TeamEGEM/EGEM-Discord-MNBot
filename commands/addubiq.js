const Web3 = require("web3");
const Discord = require("discord.js");
var Decimal = require('decimal.js');
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var functions = require('../func/main.js');
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
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provideregem));

const talkedRecently = new Set();

exports.run = (client, message, args) => {
  if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
    return;
  }
  const author = message.author.id;
  const user = message.author.username;

  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
      if (err) return message.reply("No Results.");
      try {
        let parsed = JSON.stringify(result);
        let obj = JSON.parse(parsed);
        let authorCheck = obj[0]["userId"];

        let ubiq = obj[0]["ubiq"];
        if (authorCheck == author) {
          if (author == authorCheck) {
            if (ubiq == "No") {
              talkedRecently.add(message.author.id);
              setTimeout(() => {
                // Removes the user from the set after 2.5 seconds
                talkedRecently.delete(message.author.id);
              }, 120000);
              //connection.query(`UPDATE dataUBIQ SET userId `, author);
              connection.query('INSERT INTO dataUBIQ (userId, userName) VALUES (?, ?)', [author,user]);
              return message.reply("You have enabled the use of UBIQ features.");
            } else {
              return message.reply("UBIQ is enabled on account.");
            }

            //console.log(obj);
          }
        }
      }catch(e){
        console.log("ERROR ::",e)
        connection.release();
        return message.reply("Not registered, use /botreg <address>.");
      }
    })
  })
}
