const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var mysql = require('mysql');

var con = mysql.createPool({
  connectionLimit : 25,
  host: "localhost",
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: "EGEMTest"
});

exports.run = (client, message, args) => {

  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    const author = message.author.id;
    const ip = args[0];
    connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
      if (!result) return message.reply("User Not Registered.");
      let parsed = JSON.stringify(result);
      let obj = JSON.parse(parsed);
      connection.query(`UPDATE data SET ip = ? WHERE userId = ?`, [ip, author]);
      console.log("data updated");
      const embed = new Discord.RichEmbed()
        .setTitle("EGEM Discord Bot.")
        .setAuthor("TheEGEMBot", miscSettings.egemspin)

        .setColor(miscSettings.okcolor)
        .setDescription("EGEM IP Update:")
        .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
        .setThumbnail(miscSettings.img32shard)

        .setTimestamp()
        .setURL("https://github.com/TeamEGEM/EGEM-Bot")
        .addField("User has updated there IP to: ", ip)

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
