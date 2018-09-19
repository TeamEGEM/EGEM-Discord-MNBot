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
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb
});

const talkedRecently = new Set();

exports.run = (client, message, args) => {
  if(message.channel.name != '🃏-blackjack') return;
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 30sec.");
    return;
  }
  if (args[0] != null) {
    return message.reply(" No Betting!")
  }
  // `m` is a message object that will be passed through the filter function
  const filter = m => m.author.id === message.author.id;
  const collector = message.channel.createMessageCollector(filter, { maxMatches: 1, time: 60000 });

  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT bjGame FROM settings WHERE id='1'", function (err, result) {
      if (!result) return message.reply("No results.");
      let parsed = JSON.stringify(result);
      let obj = JSON.parse(parsed);
      var bjGame = obj[0]['bjGame'];
      connection.query("SELECT credits FROM data WHERE userId = ?", message.author.id, function (err, result2) {
        if (err) return message.reply("No Results.");
        let parsed2 = JSON.stringify(result2);
        let obj2 = JSON.parse(parsed2);
        try {
          var credits = obj2[0]['credits'];
          if (bjGame == "Offline") {
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              // Removes the user from the set after 2.5 seconds
              talkedRecently.delete(message.author.id);
            }, 30000);
            const embed = new Discord.RichEmbed()
              .setTitle("EGEM Discord Bot.")
              .setAuthor("TheEGEMBot", miscSettings.egemspin)

              .setColor(miscSettings.okcolor)
              .setDescription("EGEM BlackJack Game:")
              .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
              .setThumbnail(miscSettings.img32shard)

              .setTimestamp()
              .setURL(miscSettings.ghlink)
              .addField("Game is: ", bjGame)

              return message.reply({embed})
          } else {
            let dealerhand1 = Math.floor((Math.random() * 11) + 1);
            let playerhand1 = Math.floor((Math.random() * 11) + 1);

            const embed = new Discord.RichEmbed()
              .setTitle("EGEM Discord Bot.")
              .setAuthor("TheEGEMBot", miscSettings.egemspin)

              .setColor(miscSettings.okcolor)
              .setDescription("EGEM BlackJack Game:")
              .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
              .setThumbnail(miscSettings.blackjack)

              .setTimestamp()
              .setURL(miscSettings.ghlink)
              .addField("Dealer shuffles the deck.", "Here is your first card for this round.")
              .addField("🧟 Player Card #1:", "🃏 " + playerhand1)
              .addField("🧙 Dealer Card #1:", "🃏 " + dealerhand1)
              .addField("Hit or Stand","One minute to pick, mistakes will result in a fail.")

            message.reply({embed})

            collector.on('collect', m => {
              if (m.content === 'hit' || m.content === 'Hit') {
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                  // Removes the user from the set after 2.5 seconds
                  talkedRecently.delete(message.author.id);
                }, 30000);

                let playerhand2 = Math.floor((Math.random() * 11) + 1);
                let dealerhand2 = Math.floor((Math.random() * 11) + 1);

                var dealerhand = dealerhand1+dealerhand2;
                let playerhand = playerhand1+playerhand2;

                if (playerhand > dealerhand && playerhand <= 21) {
                  var amount = (Math.random() * (0.010 - 0.0050) + 0.0050).toFixed(8);
                  var weiAmount = amount*Math.pow(10,18);
                  var newBal = (Number(credits) + Number(weiAmount));
                  var results = "Won! :trophy:";
                  var winnings = "A Taco! :taco:";
                  connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [functions.numberToString(newBal),message.author.id]);
                } else if (playerhand == dealerhand) {
                  var amount = 0;
                  var results = "Draw! :space_invader:";
                  var winnings = "Broke Even";
                } else {
                  var amount = 0;
                  var results = "Lost! :x:";
                  var winnings = "Nothing";
                }

                message.reply(` wants to ${m.content}.`);

                const embed = new Discord.RichEmbed()
                  .setTitle("EGEM Discord Bot.")
                  .setAuthor("TheEGEMBot", miscSettings.egemspin)

                  .setColor(miscSettings.okcolor)
                  .setDescription("EGEM BlackJack Game:")
                  .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
                  .setThumbnail(miscSettings.blackjack)

                  .setTimestamp()
                  .setURL(miscSettings.ghlink)
                  .addField("Dealer shuffles the deck.", "Here are your final cards for this round.")
                  .addField("🧟 Player Hand:", "🃏 " + playerhand1 + " + " + " 🃏 " + playerhand2 + " = " + "( " + playerhand + " )")
                  .addField("🧙 Dealer Hand:", "🃏 " + dealerhand1 + " + " + " 🃏 " + dealerhand2 + " = " + "( " + dealerhand + " )")
                  .addField("User Results:", message.author.username +" - "+results)
                  .addField("Winnings:", winnings + " - " + amount + " EGEM")

                message.reply({embed})
              }
              if (m.content === 'stand' || m.content === 'Stand') {
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                  // Removes the user from the set after 2.5 seconds
                  talkedRecently.delete(message.author.id);
                }, 30000);
                let dealerhand2 = Math.floor((Math.random() * 11) + 1);

                var dealerhand = dealerhand1+dealerhand2;

                if (playerhand1 > dealerhand) {
                  var amount = (Math.random() * (0.010 - 0.0050) + 0.0050).toFixed(8);
                  var weiAmount = amount*Math.pow(10,18);
                  var newBal = (Number(credits) + Number(weiAmount));
                  var results = "Won! :trophy:";
                  var winnings = "A taco!";
                  connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [functions.numberToString(newBal),message.author.id]);
                } else if (playerhand1 == dealerhand) {
                  var amount = 0;
                  var results = "Draw! :space_invader:";
                  var winnings = "Broke Even";
                } else {
                  var amount = 0;
                  var results = "Lost! :x:";
                  var winnings = "Nothing";
                }

                message.reply(` wants to ${m.content}.`);

                const embed = new Discord.RichEmbed()
                  .setTitle("EGEM Discord Bot.")
                  .setAuthor("TheEGEMBot", miscSettings.egemspin)

                  .setColor(miscSettings.okcolor)
                  .setDescription("EGEM BlackJack Game:")
                  .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
                  .setThumbnail(miscSettings.blackjack)

                  .setTimestamp()
                  .setURL(miscSettings.ghlink)
                  .addField("Dealer shuffles the deck.", "Here are final your cards for this round.")
                  .addField("🧟 Player Hand:", "🃏 " + playerhand1 + " + " + " 🃏 " + "STAND" + " = " + "( " + playerhand1 + " )")
                  .addField("🧙 Dealer Hand:", "🃏 " + dealerhand1 + " + " + " 🃏 " + dealerhand2 + " = " + "( " + dealerhand + " )")
                  .addField("User Results:", message.author.username +" - "+results)
                  .addField("Winnings:", winnings + " - " + amount + " EGEM")

                message.channel.send({embed})

              }
            });

            collector.on('end', collected => {
                message.reply('Response given or, one minute has passed game over!');
            });
          }
        } catch (e) {
          console.log(e);          
          return message.reply("Not registered, use /botreg <address>.");
        }

    })

  })
    connection.release();
  });//end con
}//end all
