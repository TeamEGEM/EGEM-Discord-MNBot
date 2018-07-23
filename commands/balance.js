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
  user: "root",
  password: botSettings.mysqlpass,
  database: "EGEMTest"
});

exports.run = (client, message, args) => {

  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    let author = message.author.id;
    connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
      if (!result) return message.reply("User Not Registered.");
      let parsed = JSON.stringify(result);
      let obj = JSON.parse(parsed);
      //console.log(obj);
      const address = obj[0]["address"];
      try {
        var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + address, function(error, response){
          if(!error) {
            var amount = response["BALANCE"];
            connection.query(`UPDATE data SET balance = ? WHERE userId = ?`, [amount, author]);
            console.log("data updated");
            const embed = new Discord.RichEmbed()
              .setTitle("EGEM Discord Bot.")
              .setAuthor("TheEGEMBot", miscSettings.egemspin)

              .setColor(miscSettings.okcolor)
              .setDescription("EGEM Balance:")
              .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
              .setThumbnail(miscSettings.img32shard)

              .setTimestamp()
              .setURL("https://github.com/TeamEGEM/EGEM-Bot")
              .addField("User Has", Number(amount).toFixed(8) + " EGEM.")

              message.channel.send({embed})
            connection.release();
          }
        })
      } catch (e) {
        console.log(e);
        connection.release();
      }
    })
  })

}
