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
  if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");
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
          var nodesData2 = obj[0]['nodesOnline2'];
          var nodesData3 = Number(Number(nodesData) + Number(nodesData2));
          var payAmount = obj[0]['nodesPayment'];
          var payAmountBonus = obj[0]['nodesPaymentBonus'];
          var totalCredits = obj[0]['totalCredits'];
          var totalDeposits = obj[0]['totalDeposits'];
          var totalWithdrawals = obj[0]['totalWithdrawals'];
          var totalDepositCount = obj[0]['totalDepositCount'];
          var totalPay15 = obj[0]['totalPay15'];
          var dailyPayTotal = obj[0]['dailyPayTotal'];
          var dailyPayBonusTotal = obj[0]['dailyPayBonusTotal'];
          var dailyPay24hU = (Number(payAmount/Math.pow(10,18)) * Number(4));
          var dailyPay24hUTotal = (Number(dailyPay24hU) * Number(24));
          var dailyPay24hU2 = (Number(payAmountBonus/Math.pow(10,18)) * Number(4));
          var dailyPay24hUTotal2 = (Number(dailyPay24hU2) * Number(24));
          var totalPay15x4 = (Number(totalPay15 * 4));
          var totalPay24 = (Number(totalPay15x4 * 24));
          connection.query("SELECT COUNT(autoWithdrawal) AS autoWithdrawal FROM data WHERE autoWithdrawal='Yes'", function (err, res4) {
            if (err) return message.reply("No Results.");
            var parsed4 = JSON.stringify(res4);
            var obj4 = JSON.parse(parsed4);
            var autoWithdrawal = obj4[0]['autoWithdrawal'];
            connection.query("SELECT COUNT(userId) AS totalUsers FROM data", function (err, res) {
              if (err) return message.reply("No Results.");
              var parsed2 = JSON.stringify(res);
              var obj2 = JSON.parse(parsed2);
              var totalUsers = obj2[0]['totalUsers'];
              connection.query("SELECT totalWithdrawn FROM settings", function (err, res2) {
                if (err) return message.reply("No Results.");
                var parsed3 = JSON.stringify(res2);
                var obj3 = JSON.parse(parsed3);
                var totalWithdrawn = obj3[0]['totalWithdrawn'];
                connection.query("SELECT totalLocked FROM settings", function (err, res3) {
                  if (err) return message.reply("No Results.");
                  var parsed4 = JSON.stringify(res3);
                  var obj4 = JSON.parse(parsed4);
                  var totalLocked = obj4[0]['totalLocked'];
                  const embed = new Discord.RichEmbed()
                    .setTitle("EGEM Discord Bot.")
                    .setAuthor("TheEGEMBot", miscSettings.egemspin)

                    .setColor(miscSettings.okcolor)
                    .setDescription("EGEM Quarry Status Info:")
                    .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
                    .setThumbnail(miscSettings.img32shard)

                    .setTimestamp()
                    .setURL(miscSettings.ghlink)
                    .addField("Deposit Address:", "["+address+"](https://explorer.egem.io/addr/" +address+ ")")
                    .addField("Quarry Balance:", ":moneybag: = "+amount + " EGEM.")
                    .addField("Total Users Registered  |  Nodes Online  |  Estimated EGEM Locked:", "👥 = "+totalUsers+ " users in Database."+"  |  "+"✅ = "+nodesData3+" :moneybag: = "+Number(totalLocked).toFixed(0) + " EGEM.")
                    .addField("Autopay Enabled Users: ", autoWithdrawal)
                    .addField("All Credits In Database:", ":moneybag: = "+totalCredits/Math.pow(10,18) + " EGEM.")
                    .addField("Total Credits Withdrawn:", "💳 = "+totalWithdrawn/Math.pow(10,18) + " EGEM in " +totalWithdrawals +" Withdrawals.")
                    .addField("Total Credit Deposits:", "💳 = "+totalDeposits/Math.pow(10,18) + " EGEM in "+totalDepositCount +" Deposits.")
                    .addField("ATTENTION: ", "Please use /paystats to see node rewards and info.")

                    connection.release();
                    return message.reply({embed});
                  })
              })
            })
        })



        });
      });

    }
  })
}
