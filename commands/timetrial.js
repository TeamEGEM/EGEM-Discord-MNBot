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

exports.run = (client, message, args) => {
  if(message.channel.name != '🏁-timetrial') return;
  const bet = Number(args[0]);
  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT timeGame FROM settings WHERE id='1'", function (err, result) {
      if (!result) return message.reply("No results.");
      let parsed = JSON.stringify(result);
      let obj = JSON.parse(parsed);
      var timeGame = obj[0]['timeGame'];
      var author = message.author.id;

      let roll = Math.floor((Math.random() * 10) + 1);

      connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result2) {

        if (err) return message.reply("No Results.");
        var parsed2 = JSON.stringify(result2);
        var obj2 = JSON.parse(parsed2);

        try {
        var credits = obj2[0]['credits'];
        if (timeGame == "Offline") {
          const embed = new Discord.RichEmbed()
            .setTitle("EGEM Discord Bot.")
            .setAuthor("TheEGEMBot", miscSettings.egemspin)

            .setColor(miscSettings.okcolor)
            .setDescription("EGEM Timetrial Game:")
            .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
            .setThumbnail(miscSettings.img32shard)

            .setTimestamp()
            .setURL("https://github.com/TeamEGEM/EGEM-Bot")
            .addField("Game is: ", timeGame)

            connection.release();
            return message.reply({embed})

        } else {
              const embed = new Discord.RichEmbed()
          			.setTitle("EGEM Discord Bot.")
          			.setAuthor("TheEGEMBot", miscSettings.egemspin)

          			.setColor(miscSettings.okcolor)
          			.setDescription("EGEM Time Trial:")
          			.setFooter(miscSettings.footerBranding, miscSettings.img32x32)
          			.setThumbnail(miscSettings.stopwatch)

          			.setTimestamp()
          			.setURL("https://github.com/TeamEGEM/EGEM-Bot")
          			.addField("START!", "You have 15 Seconds to get the correct number between 1 - 30")

          		message.channel.send({embed})
          		.then(() => {
          			var number = Math.floor((Math.random() * 30) + 1)
          			//console.log(number)
          	  	message.channel.awaitMessages(response => response.content == Number(number), {
          	    max: 1,
          	    time: 15000,
          	    errors: ['time'],
          		})
          	  .then((collected) => {
          			let amount = (Math.random() * (0.100 - 0.0050) + 0.0050).toFixed(8);
          			let weiAmount = amount*Math.pow(10,18);
                var winTotal = Number(Number(weiAmount) + Number(credits));
                //console.log(winTotal);
                connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [functions.numberToString(winTotal),message.author.id]);
          			const embed = new Discord.RichEmbed()
          				.setTitle("EGEM Discord Bot.")
          				.setAuthor("TheEGEMBot", miscSettings.egemspin)

          				.setColor(miscSettings.okcolor)
          				.setDescription("EGEM Time Trial Game:")
          				.setFooter(miscSettings.footerBranding, miscSettings.img32x32)
          				.setThumbnail(miscSettings.stopwatch)

          				.setTimestamp()
          				.setURL("https://github.com/TeamEGEM/EGEM-Bot")
          				.addField("WINNER! :first_place: "+ Number(amount)+" EGEM", "@" + message.author.username + " The correct number is: " +number)
                  .addField("New Balance: ", Number(winTotal/Math.pow(10,18))+ " EGEM.")

          			message.channel.send({embed})

          			// // Adds the user to the set so that they can't talk for x
          			// trialcooldown.add(message.author.id);
          			// setTimeout(() => {
          			// 	// Removes the user from the set after a minute
          			// 	trialcooldown.delete(message.author.id);
          			// }, miscSettings.cdtimetrial);
          		})
              .catch(() => {
          			const embed = new Discord.RichEmbed()
          				.setTitle("EGEM Discord Bot.")
          				.setAuthor("TheEGEMBot", miscSettings.egemspin)

          				.setColor(miscSettings.warningcolor)
          				.setDescription("EGEM Time Trial Game:")
          				.setFooter(miscSettings.footerBranding, miscSettings.img32x32)
          				.setThumbnail(miscSettings.stopwatch)

          				.setTimestamp()
          				.setURL("https://github.com/TeamEGEM/EGEM-Bot")
          				.addField("NO WINNER!", "There was no correct answer within the time limit!")
                  .addField("Answer was: ", number)

          			message.channel.send({embed})
              });
            })

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
