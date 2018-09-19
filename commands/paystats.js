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
          var totalPay15 = obj[0]['totalPay15'];
          var dailyPayTotal = obj[0]['dailyPayTotal'];
          var dailyPayBonusTotal = obj[0]['dailyPayBonusTotal'];
          var dailyPay24hU = (Number(payAmount/Math.pow(10,18)) * Number(4));
          var dailyPay24hUTotal = (Number(dailyPay24hU) * Number(24));
          var dailyPay24hU2 = (Number(payAmountBonus/Math.pow(10,18)) * Number(4));
          var dailyPay24hUTotal2 = (Number(dailyPay24hU2) * Number(24));
          var totalPay15x4 = (Number(totalPay15 * 4));
          var totalPay24 = (Number(totalPay15x4 * 24));
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
                  .addField("Primary 24h Share:", "💰 = "+dailyPayTotal+ " EGEM",true)
                  .addField("Secondary 24h Share:", "💰 = "+dailyPayBonusTotal+ " EGEM",true)
                  .addField("Pri. Nodes Online  |  10,000c | Sec. Nodes Online  |  30,000c:", "✅ = "+nodesData+" -----|----- "+"✅ = "+nodesData2)
                  .addField("Pri. 15min Per Node  |  Sec. 15min Per Node:", "⛏ = "+functions.numberToString(payAmount/Math.pow(10,18)) + " EGEM."+"  |  "+"⛏ = "+functions.numberToString(payAmountBonus/Math.pow(10,18)) + " EGEM.")
                  .addField("Primary 24h/Pay Per Node  |  Secondary 24h/Pay Per Node:", "⛏ = "+dailyPay24hUTotal+"  |  "+"⛏ = "+dailyPay24hUTotal2)
                  .addField("Estimated Actual For All Nodes:", "✅ = "+(totalPay15/Math.pow(10,18))+ " EGEM per 15min.")
                  .addField("Estimated Actual 24h:", "✅ = "+(totalPay24/Math.pow(10,18))+ " EGEM per 24hours, includes beta users.")
                  .addField("ATTENTION: ", "Due to the way the system works the above stats will change and update depending on certain variables, and will never be the same for very long.")

                  connection.release();
                  return message.reply({embed});
                })
            })
          })



        });
      });

    }
  })
}
