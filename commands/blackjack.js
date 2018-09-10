const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var mysql = require('mysql');

var con = mysql.createPool({
  connectionLimit : 25,
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb
});

exports.run = (client, message, args) => {
  if(message.channel.name != '🃏-blackjack') return;
  // get the cards for the hands
  let dealerhand1 = Math.floor((Math.random() * 13) + 1);
  let playerhand1 = Math.floor((Math.random() * 13) + 1);
  if (dealerhand1 >= 11) {
    let dealerhand1 = 11;
  }
  if (playerhand1 >= 11) {
    let playerhand1 = 11;
  }
  const embed = new Discord.RichEmbed()
    .setTitle("EGEM Discord Bot.")
    .setAuthor("TheEGEMBot", miscSettings.egemspin)

    .setColor(miscSettings.okcolor)
    .setDescription("EGEM BlackJack Game:")
    .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
    .setThumbnail(miscSettings.blackjack)

    .setTimestamp()
    .setURL("https://github.com/TeamEGEM/EGEM-Bot")
    .addField("Dealer shuffles the deck.", "Here is your first card for this round.")
    .addField("🧟 Player Card #1:", "🃏 " + playerhand1)
    .addField("🧙 Dealer Card #1:", "🃏 " + dealerhand1)
    .addField("Hit or Stand","One minute to pick...")

  message.channel.send({embed})
  .then(() => {
    message.channel.awaitMessages(response => response.content === 'Hit' || response.content === 'Stand', {
      max: 1,
      time: 60000,
      errors: ['time'],
    })
    .then((collected) => {
      if (collected.first().content == "Hit") {
        let playerhand2 = Math.floor((Math.random() * 13) + 1);
        let dealerhand2 = Math.floor((Math.random() * 13) + 1);
        if (dealerhand2 >= 11) {
          let dealerhand2 = 11;
        }
        if (playerhand2 >= 11) {
          let playerhand2 = 11;
        }
        var dealerhand = dealerhand1+dealerhand2;
        let playerhand = playerhand1+playerhand2;
        message.reply("is going to Hit!");
        //message.channel.send('Player Hand Final.' + playerhand);
        //message.channel.send('Dealer Hand Final. ' + dealerhand);
        if (playerhand > dealerhand && playerhand <= 21) {
          var results = "Win!";
        } else {
          var results = "Loss";
        }
        const embed = new Discord.RichEmbed()
          .setTitle("EGEM Discord Bot.")
          .setAuthor("TheEGEMBot", miscSettings.egemspin)

          .setColor(miscSettings.okcolor)
          .setDescription("EGEM BlackJack Game:")
          .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
          .setThumbnail(miscSettings.blackjack)

          .setTimestamp()
          .setURL("https://github.com/TeamEGEM/EGEM-Bot")
          .addField("Dealer shuffles the deck.", "Here are your final cards for this round.")
          .addField("🧟 Player Hand:", "🃏 " + playerhand1 + " + " + " 🃏 " + playerhand2 + " = " + "( " + playerhand + " )")
          .addField("🧙 Dealer Hand:", "🃏 " + dealerhand1 + " + " + " 🃏 " + dealerhand2 + " = " + "( " + dealerhand + " )")
          .addField("Results:", results)

        message.channel.send({embed})
      } else if (collected.first().content == "Stand") {
        let dealerhand2 = Math.floor((Math.random() * 13) + 1);
        var dealerhand = dealerhand1+dealerhand2;
        message.reply("is going to Stand!");
        if (playerhand1 > dealerhand) {
          var results = "Win!";
        } else {
          var results = "Loss";
        }
        const embed = new Discord.RichEmbed()
          .setTitle("EGEM Discord Bot.")
          .setAuthor("TheEGEMBot", miscSettings.egemspin)

          .setColor(miscSettings.okcolor)
          .setDescription("EGEM BlackJack Game:")
          .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
          .setThumbnail(miscSettings.blackjack)

          .setTimestamp()
          .setURL("https://github.com/TeamEGEM/EGEM-Bot")
          .addField("Dealer shuffles the deck.", "Here are final your cards for this round.")
          .addField("🧟 Player Hand:", "🃏 " + playerhand1 + " + " + " 🃏 " + "STAND" + " = " + "( " + playerhand1 + " )")
          .addField("🧙 Dealer Hand:", "🃏 " + dealerhand1 + " + " + " 🃏 " + dealerhand2 + " = " + "( " + dealerhand + " )")
          .addField("Results:", results)

        message.channel.send({embed})
      }

    })
    .catch(() => {
      message.channel.send('One minute has passed game over!');
    });
  });
}
