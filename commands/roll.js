const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var mysql = require('mysql');
var functions = require('../func/main.js');
var con = mysql.createPool({
  connectionLimit : 50,
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb
});

const talkedRecently = new Set();
const talkedRecently2 = new Set();

exports.run = (client, message, args) => {
  if(message.channel.name != '🎲-roll') return;

  const bet = Number(args[0]);
  const userBet = Number(bet*Math.pow(10,18))
  const maxAllowedBet = Number(11*Math.pow(10,18))
  const minAllowedBet = Number(1000000000000)
  if (userBet <= minAllowedBet) {
    return message.reply("Im sorry you can not bet that amount! MIN 0.000001.");
  }
  if (userBet >= maxAllowedBet) {
    return message.reply("Im sorry you can not bet that amount! MAX 10.");
  }
  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT rollGame FROM settings WHERE id='1'", function (err, result) {
      if (!result) return message.reply("No results.");
      let parsed = JSON.stringify(result);
      let obj = JSON.parse(parsed);
      var rollGame = obj[0]['rollGame'];
      var author = message.author.id;

      let roll = Math.floor((Math.random() * 10) + 1);

      connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result2) {

        if (err) return message.reply("No Results.");
        var parsed2 = JSON.stringify(result2);
        var obj2 = JSON.parse(parsed2);

        try {
        var credits = obj2[0]['credits']
        if (rollGame == "Offline") {
          const embed = new Discord.RichEmbed()
            .setTitle("EGEM Discord Bot.")
            .setAuthor("TheEGEMBot", miscSettings.egemspin)

            .setColor(miscSettings.okcolor)
            .setDescription("EGEM Roll Game:")
            .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
            .setThumbnail(miscSettings.img32shard)

            .setTimestamp()
            .setURL("https://github.com/TeamEGEM/EGEM-Bot")
            .addField("Game is: ", rollGame)

            connection.release();
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              // Removes the user from the set after 2.5 seconds
              talkedRecently.delete(message.author.id);
            }, 120000);
            return message.reply({embed})

        } else {

          if(isNaN(bet)){
            if (talkedRecently.has(message.author.id)) {
              message.reply("Wait for the cooldown! 120sec.");
              return;
            }
            connection.release();
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              // Removes the user from the set after 2.5 seconds
              talkedRecently.delete(message.author.id);
            }, 120000);
            if (roll >= 5) {
              let amount = (Math.random() * (0.020 - 0.0050) + 0.0050).toFixed(8);
              let weiAmount = amount*Math.pow(10,18);
              var newBal = (Number(credits) + Number(weiAmount))
              var chatBal = functions.numberToString(newBal)/Math.pow(10,18)
              connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [functions.numberToString(newBal),message.author.id]);
              return message.reply("Win!"+" :trophy: You rolled a: "+roll+" | New Balance: "+ chatBal+ " | Amount Won: " + amount)
            } else {
              return message.reply("Lost!"+" :x: You rolled a: "+roll)
            }
          } else {
            if (talkedRecently2.has(message.author.id)) {
              message.reply("Wait for the cooldown! 10sec.");
              return;
            }
            //connection.release();
            talkedRecently2.add(message.author.id);
            setTimeout(() => {
              // Removes the user from the set after 2.5 seconds
              talkedRecently2.delete(message.author.id);
            }, 10000);
            var winBet = Number(bet*Math.pow(10,18))
            if (winBet >= credits) {
              return message.reply("Not enough credits to bet.")
            }
            var ifNeg = Math.sign(winBet);
            if (ifNeg == "-1") {
              return message.reply("You can't bet a negative amount.");
            }
            if(roll >= 6) {
              //message.reply("non free roll "+ roll + " credits: " + credits + " winbet: " + winBet)
              var newBal = (Number(credits) + Number(winBet))
              var chatBal = functions.numberToString(newBal)/Math.pow(10,18)
              connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [functions.numberToString(newBal),message.author.id]);
              connection.release();
              return message.reply("Win!"+" :trophy: You rolled a: "+roll+" | New Balance: "+ chatBal)
            } else {
              //message.reply("non free roll "+ roll + " credits: " + credits + " winbet: " + winBet)
              var newBal = (Number(credits) - Number(winBet))
              var chatBal = functions.numberToString(newBal)/Math.pow(10,18)
              connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [functions.numberToString(newBal),message.author.id]);
              connection.release();
              return message.reply("Lost!"+" :x: You rolled a: "+roll+" | New Balance: "+ chatBal)
            }

          }

        }
        connection.release();
        } catch (e) {
          console.log(e);
          return message.reply("Not registered, use /botreg <address>.");
        }
      })

    })
  })

}
