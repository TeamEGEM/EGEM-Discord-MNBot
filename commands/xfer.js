const Web3 = require("web3");
const Discord = require("discord.js");
var Decimal = require('decimal.js');
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

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));


exports.run = (client, message, args) => {

  var user = message.author.username;
  var author = message.author.id;
  var person = args[0];
  var value = args[1];
  var feeXferAmount = botSettings.txxferfee;
  var z = Number(feeXferAmount);

  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
      if (err) return message.reply("No Results.");
      try {
        let parsed = JSON.stringify(result);
        let obj = JSON.parse(parsed);
        let authorCheck = obj[0]["userId"];

        let amount = obj[0]["balance"];
        var oldBal = parseInt(result[0]['credits']);
        var newBal = Number(value);

        var ly = (newBal).toString(10)
        var y = web3.utils.toWei(ly, 'ether');

        const embed = new Discord.RichEmbed()
          .setTitle("EGEM Discord Bot.")
          .setAuthor("TheEGEMBot", miscSettings.egemspin)

          .setColor(miscSettings.okcolor)
          .setDescription("Credit Balance Transfer:")
          .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
          .setThumbnail(miscSettings.img32shard)

          .setTimestamp()
          .setURL("https://github.com/TeamEGEM/EGEM-Bot")
          .addField("Amount Sent: ", address)
          .addField("Fee Deducted: ", z)


          return message.channel.send({embed});

      }catch(e){
        console.log("ERROR ::",e)
        connection.release();
        return message.reply("Not registered.");
      }
    })
  })
}
