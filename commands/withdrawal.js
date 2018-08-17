const Discord = require("discord.js");
const Web3 = require("web3");
var Decimal = require('decimal.js');
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var functions = require('../func/main.js');
var mysql = require('mysql');

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

var pool = mysql.createPool({
  connectionLimit : 25,
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb
});
const talkedRecently = new Set();
exports.run = (client, message, args) => {
  //if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
    return;
  }
  var botAddy = botSettings.address;
  var value = args[0];
  var feeAmount = botSettings.txfee;
  var z = Number(feeAmount);

  pool.getConnection(function(err, connection) {

    pool.query("SELECT * FROM data WHERE userId = ?", message.author.id, function (err, result) {
      if (err) return console.log(err);
      try {
        var oldBal = parseInt(result[0]['credits']);
        var newBal = Number(value);
        var x2 = Number(oldBal);
        var x = Number(x2 - z);
        if(isNaN(value)){
         return message.reply("That is not a valid number, Abuse will result in a cheating flag.");
        }
        var ly = (newBal).toString(10)
        var y = web3.utils.toWei(ly, 'ether');
        var ifNeg = Math.sign(newBal);
        var balance = Number(x - y);
        //var balanceFinal = (balance*Math.pow(10,18));

        if (ifNeg == "-1") {
          return message.reply("You can't withdrawal a negative amount, Abuse will result in a cheating flag.");
        }
        if (x < y) {
          return message.reply("You don't have enough to withdrawal that amount.");
        }
        var address = result[0]['address'];
        var name = result[0]['userName'];
        console.log("Balance: " + (x));
        console.log("Withdrawal: " + (y));

        var balanceFinal = functions.numberToString(balance);
        //message.reply("New: " + balanceFinal);
        //console.log(balanceFinal);

        connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [balanceFinal,message.author.id]);

        function sendCoins(address,value,message,name){
          web3.eth.sendTransaction({
              from: botAddy,
              to: address,
              gas: web3.utils.toHex(miscSettings.txgas),
              value: (y)
          })
          .on('transactionHash', function(hash){
            // sent pm with their tx
            // recive latest array
            if(name != 1){
              const embed = new Discord.RichEmbed()
                .setTitle("EGEM Discord Bot.")
                .setAuthor("TheEGEMBot", miscSettings.egemspin)

                .setColor(miscSettings.okcolor)
                .setDescription("Bot Withdrawal")
                .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
                .setThumbnail(miscSettings.img32shard)

                .setTimestamp()
                .setURL("https://github.com/TeamEGEM/EGEM-Bot")
                .addField("Value Sent:", (value/Math.pow(10,18)) + " EGEM")
                .addField("Fee Deducted:", (z/Math.pow(10,18)) + " EGEM")
                .addField("Credits Remaining:", (balanceFinal/Math.pow(10,18)) + " EGEM")
                .addField("TX Sent:", "["+hash+"](https://explorer.egem.io/tx/" +hash+ ")")
                message.reply({embed})
                console.log("Withdrawal Processed: " + hash)
                pool.query("INSERT INTO txdatasent(`hash`,`to`,`value`) values(?,?,?)",[hash,address,value]);
            } else {
              const embed = new Discord.RichEmbed()
                .setTitle("EGEM Discord Bot.")
                .setAuthor("TheEGEMBot", miscSettings.egemspin)

                .setColor(miscSettings.okcolor)
                .setDescription("Bot Withdrawal")
                .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
                .setThumbnail(miscSettings.img32shard)

                .setTimestamp()
                .setURL("https://github.com/TeamEGEM/EGEM-Bot")
                .addField("Value Sent:", (value/Math.pow(10,18)) + " EGEM")
                .addField("Fee Deducted:", (z/Math.pow(10,18)) + " EGEM")
                .addField("Credits Remaining:", (balanceFinal/Math.pow(10,18)) + " EGEM")
                .addField("TX Sent:", "["+hash+"](https://explorer.egem.io/tx/" +hash+ ")")
                message.reply({embed})
                console.log("Withdrawal Processed: " + hash)
                pool.query("INSERT INTO txdatasent(`hash`,`to`,`value`) values(?,?,?)",[hash,address,value]);
            }

          })
          .on('error', console.error);
        }

        sendCoins(address,y,message,name);
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after 2.5 seconds
          talkedRecently.delete(message.author.id);
        }, 120000);
      } catch (e) {
        console.log("ERROR ::",e)
        connection.release();
        return message.reply("Not registered, use /botreg <address>.");
      }

    })


  })


}
