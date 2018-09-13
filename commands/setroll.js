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
  if(!message.member.hasPermission('ADMINISTRATOR')){
    return message.channel.send("You cannot use '/setroll' command");
  }
  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    const response = args[0];
    connection.query("SELECT * FROM data WHERE userId = ?", message.author.id, function (err, result) {
      if (!result) return message.reply("User Not registered, use /botreg <address>.");
      try {
        connection.query(`UPDATE settings SET rollGame = ?`, response);
        console.log("data updated");
        const embed = new Discord.RichEmbed()
          .setTitle("EGEM Discord Bot.")
          .setAuthor("TheEGEMBot", miscSettings.egemspin)

          .setColor(miscSettings.okcolor)
          .setDescription("EGEM Game Update:")
          .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
          .setThumbnail(miscSettings.img32shard)

          .setTimestamp()
          .setURL(miscSettings.ghlink)
          .addField("Roll Game set to: ", response)

          message.reply({embed})
        connection.release();
      } catch (e) {
        console.log(e);
        connection.release();
      }
    })
  })

}
