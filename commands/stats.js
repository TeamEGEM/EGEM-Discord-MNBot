const Discord = require("discord.js");
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
const talkedRecently = new Set();
exports.run = (client, message, args) => {
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
    return;
  }
  var address = "0xd66f71aa3e24acfcb2e96eedf3d2516711d95d88";

  var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + address, function(error, response){
    if(!error) {
      var amount = response["BALANCE"];
      var id = 1;
      con.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        connection.query("SELECT * FROM settings WHERE id = ?", id, function (err, result) {
          if (err) return message.reply("No Results.");
          var parsed = JSON.stringify(result);
          var obj = JSON.parse(parsed);
          var nodesData = obj[0]['nodesOnline'];
          var payAmount = obj[0]['nodesPayment'];
          var totalCredits = obj[0]['totalCredits'];
          var dailyPayTotal = obj[0]['dailyPayTotal'];
          var dailyPay24hU = (Number(payAmount/Math.pow(10,18)) * Number(4));
          var dailyPay24hUTotal = (Number(dailyPay24hU) * Number(24));
          connection.query("SELECT COUNT(userId) AS totalUsers FROM data", function (err, res) {
            if (err) return message.reply("No Results.");
            var parsed2 = JSON.stringify(res);
            var obj2 = JSON.parse(parsed2);
            var totalUsers = obj2[0]['totalUsers'];
            connection.query("SELECT SUM(value) AS totalWithdrawn FROM txdatasent", function (err, res2) {
              if (err) return message.reply("No Results.");
              var parsed3 = JSON.stringify(res2);
              var obj3 = JSON.parse(parsed3);
              var totalWithdrawn = obj3[0]['totalWithdrawn'];
            const embed = new Discord.RichEmbed()
              .setTitle("EGEM Discord Bot.")
              .setAuthor("TheEGEMBot", miscSettings.egemspin)

              .setColor(miscSettings.okcolor)
              .setDescription("EGEM Quarry Status Info:")
              .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
              .setThumbnail(miscSettings.img32shard)

              .setTimestamp()
              .setURL("https://github.com/TeamEGEM/EGEM-Bot")
              .addField("Bot Address: ", address)
              .addField("Quarry Balance: ", "💳 = "+amount + " EGEM.",true)
              .addField("Total Distributed Every 24 Hours: ", "💰 = "+dailyPayTotal+ " EGEM",true)
              .addField("All Credits In Database: ", "💳 = "+totalCredits/Math.pow(10,18) + " EGEM.",true)
              .addField("Total Credits Withdrawn: ", "💳 = "+totalWithdrawn/Math.pow(10,18) + " EGEM.",true)
              .addField("Total Users Registered: ", "👥 = "+totalUsers+ " users in Database.",true)
              .addField("Current Nodes Online: ", "✅ = "+nodesData,true)
              .addField("15min Pay Per Node: ", "⛏ = "+functions.numberToString(payAmount/Math.pow(10,18)) + " EGEM.",true)
              .addField("Current 24h/Pay Per Node: ", "⛏ = "+dailyPay24hUTotal,true)
              .addField("ATTENTION: ", "Due to the way the system works the above stats will change and update depending on certain variables, and will never be the same for very long.")

              connection.release();
              return message.reply({embed});
            })
          })



        });
      });

    }
  })
}
