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
  if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");
  if(!message.member.hasPermission('ADMINISTRATOR')){
    return message.channel.send("You cannot use '/flagcheater' command");
  }
  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    const author = args[0];
    const hasCheated = args[1];
    connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
      if (!result) return message.reply("User Not registered, use /botreg <address>.");
      let parsed = JSON.stringify(result);
      let obj = JSON.parse(parsed);
      connection.query(`UPDATE data SET hasCheated = ? WHERE userId = ?`, [hasCheated, author]);
      console.log("data updated");
      const embed = new Discord.RichEmbed()
        .setTitle("EGEM Discord Bot.")
        .setAuthor("TheEGEMBot", miscSettings.egemspin)

        .setColor(miscSettings.okcolor)
        .setDescription("EGEM User Updated:")
        .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
        .setThumbnail(miscSettings.img32shard)

        .setTimestamp()
        .setURL(miscSettings.ghlink)
        .addField("Cheat flag set to: ", "**" + hasCheated + "**" + " on "+author)

        message.channel.send({embed})
      connection.release();
      try {

      } catch (e) {
        console.log(e);
        connection.release();
      }
    })
  })

}
