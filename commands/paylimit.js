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
  con.getConnection(function(err, connection) {
    const author = message.author.id;
    const paylimit = args[0];

    if (err) throw err; // not connected!
    connection.query("SELECT address FROM data", function (err, blacklist) {
      if (err) return message.reply("No Results.");
      let parsed = JSON.stringify(blacklist);
      let obj = JSON.parse(parsed);

      if (paylimit > 50 || paylimit < 1 || isNaN(paylimit) || paylimit == null) {
        return message.reply("Please pick a number from 1 min - 50 max EGEM.")
      } else {
        connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
          if (!result) return message.reply("User Not registered, use /botreg <address>.");
          let parsed = JSON.stringify(result);
          let obj = JSON.parse(parsed);
          var paylimitWei = paylimit*Math.pow(10,18);
          connection.query(`UPDATE data SET minBalance = ? WHERE userId = ?`, [paylimitWei, author]);
          console.log("data updated");
          const embed = new Discord.RichEmbed()
            .setTitle("EGEM Discord Bot.")
            .setAuthor("TheEGEMBot", miscSettings.egemspin)

            .setColor(miscSettings.okcolor)
            .setDescription("EGEM Pay Limit Update:")
            .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
            .setThumbnail(miscSettings.img32shard)

            .setTimestamp()
            .setURL(miscSettings.ghlink)
            .addField("Pay threshold updated to: ", paylimit +" EGEM")

            message.channel.send({embed})
          connection.release();
          try {

          } catch (e) {
            console.log(e);
            connection.release();
          }
        })
      }
    })

  })

}
