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
    return message.channel.send("You cannot use '/setdaily' command");
  }
  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    const pay = args[0];
    connection.query(`UPDATE settings SET dailyPayBonusTotal = ? WHERE id='1'`, pay);
    console.log("data updated");
    const embed = new Discord.RichEmbed()
      .setTitle("EGEM Discord Bot.")
      .setAuthor("TheEGEMBot", miscSettings.egemspin)

      .setColor(miscSettings.okcolor)
      .setDescription("EGEM Daily Bonus Pay Amount Updated:")
      .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
      .setThumbnail(miscSettings.img32shard)

      .setTimestamp()
      .setURL("https://github.com/TeamEGEM/EGEM-Bot")
      .addField("Amount set to:", +pay+ " EGEM per/24h")

      message.channel.send({embed})
    connection.release();
  })

}
