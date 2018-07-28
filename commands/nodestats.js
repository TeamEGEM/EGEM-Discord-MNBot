const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var functions = require('../func/main.js');
var mysql = require('mysql');

var con = mysql.createPool({
  connectionLimit : 25,
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb
});

exports.run = (client, message, args) => {
  var address = "0xd66f71aa3e24acfcb2e96eedf3d2516711d95d88";

  var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + address, function(error, response){
    if(!error) {
      var amount = response["BALANCE"];
      var id = 1;
      con.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        connection.query("SELECT * FROM settings WHERE id = ?", id, function (err, result) {
          if (err) return message.reply("No Results.");
          var parsed = JSON.stringify(result);
          var obj = JSON.parse(parsed);
          var nodesData = obj[0]['nodesOnline'];
          var payAmount = obj[0]['payment'];
          const embed = new Discord.RichEmbed()
            .setTitle("EGEM Discord Bot.")
            .setAuthor("TheEGEMBot", miscSettings.egemspin)

            .setColor(miscSettings.okcolor)
            .setDescription("EGEM Address Update:")
            .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
            .setThumbnail(miscSettings.img32shard)

            .setTimestamp()
            .setURL("https://github.com/TeamEGEM/EGEM-Bot")
            .addField("Bot Address: ", address)
            .addField("Contains: ", amount + " EGEM.")
            .addField("Nodes Online: ", nodesData)
            .addField("Current Payment: ", payAmount)

            connection.release();
            return message.channel.send({embed});

        });
      });

    }
  })
}
