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

const talkedRecently = new Set();

exports.run = (client, message, args) => {
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
    return;
  }
  const bet = Number(args[0]);
  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT rollGame FROM settings WHERE id='1'", function (err, result) {
      if (!result) return message.reply("User Not Registered.");
      let parsed = JSON.stringify(result);
      let obj = JSON.parse(parsed);
      var rollGame = obj[0]['rollGame'];
      let roll = Math.floor((Math.random() * 10) + 1);
      try {
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
          return message.reply({embed})

      }
        // if (bet == null) {
        //   return message.reply("free roll "+ roll)
        // }
        if(isNaN(bet)){
          connection.release();
          return message.reply("free roll "+ roll)
        }
        message.reply("nonfree roll "+ roll)
        connection.release();
      } catch (e) {
        console.log(e);
        connection.release();
      }
    })
  })

}
