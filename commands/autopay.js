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
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

const talkedRecently = new Set();

exports.run = (client, message, args) => {
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
    return;
  }
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
        let address = obj[0]["address"];
        let canEarn = obj[0]["canEarn"];
        let hasCheated = obj[0]["hasCheated"];
        let regTxSent = obj[0]["regTxSent"];
        let isOnline = obj[0]["isOnline"];
        let isOnline2 = obj[0]["isOnline2"];
        let creditsRaw = obj[0]["credits"];
        let betaTester = obj[0]["betaTester"];
        var BN = web3.utils.BN;
        let creditsBN = new BN(creditsRaw).toString();
        let creditsT = web3.utils.fromWei(creditsBN, 'ether');
        var credits = (creditsT/Math.pow(10,18)).toFixed(16);
        let nodeBonusPay = obj[0]["nodeBonusPay"];
        let numberOfWD = obj[0]["numberOfWD"];
        let numberOfWDAmount = obj[0]["numberOfWDAmount"];
        let myPay = obj[0]["myPay"];
        let ip = obj[0]["ip"];
        let ip2 = obj[0]["ip2"];
        let autoWithdrawals = obj[0]["autoWithdrawal"];
        if (authorCheck == author) {
          if (author == authorCheck) {
            if (autoWithdrawals == "Yes") {
              talkedRecently.add(message.author.id);
              setTimeout(() => {
                // Removes the user from the set after 2.5 seconds
                talkedRecently.delete(message.author.id);
              }, 120000);
              let response = "No";
              connection.query(`UPDATE data SET autoWithdrawal =? WHERE userId = ?`, [response,author]);
              return message.reply("Auto pay updated to No, User must manually withdrawal credits earned.");
            }
            if (autoWithdrawals == "No") {
              talkedRecently.add(message.author.id);
              setTimeout(() => {
                // Removes the user from the set after 2.5 seconds
                talkedRecently.delete(message.author.id);
              }, 120000);
              let response = "Yes";
              connection.query(`UPDATE data SET autoWithdrawal =? WHERE userId = ?`, [response,author]);
              return message.reply("Auto pay updated to Yes, system will send hourly payments from credits earned.");
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
