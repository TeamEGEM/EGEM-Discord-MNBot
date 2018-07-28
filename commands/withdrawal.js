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

exports.run = (client, message, args) => {

  var botAddy = botSettings.address;
  var value = args[0];
  var feeAmount = botSettings.txfee;
  var z = Number(feeAmount);

  pool.getConnection(function(err, connection) {

    pool.query("SELECT * FROM data WHERE userId = ?", message.author.id, function (err, result) {
      if (err) console.log(err);
      var oldBal = parseInt(result[0]['credits']);
      var newBal = Number(value);
      var x2 = Number(oldBal);
      var x = Number(x2 - z);

      var ly = (newBal).toString(10)
      var y = web3.utils.toWei(ly, 'ether');
      var ifNeg = Math.sign(newBal);
      var balance = Number(x - y);
      //var balanceFinal = (balance*Math.pow(10,18));
      if (ifNeg == "-1") {
        return message.reply("You can't withdrawal a negative amount.");
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
              .addField("Value Sent:", (value/Math.pow(10,18)) + " EGEM || " + value + " WEI")
              .addField("Fee Deducted:", (z/Math.pow(10,18)) + " EGEM || " + z + " WEI")
              .addField("Credits Remaining:", (balanceFinal/Math.pow(10,18)) + " EGEM || " + balanceFinal + " WEI")
              .addField("TX Sent:", "["+hash+"](https://explorer.egem.io/tx/" +hash+ ")")
              message.reply({embed})
              console.log("Withdrawal Processed: " + hash)
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
              .addField("Value Sent:", (value/Math.pow(10,18)) + " EGEM || " + value + " WEI")
              .addField("Fee Deducted:", (z/Math.pow(10,18)) + " EGEM || " + z + " WEI")
              .addField("Credits Remaining:", (balanceFinal/Math.pow(10,18)) + " EGEM || " + balanceFinal + " WEI")
              .addField("TX Sent:", "["+hash+"](https://explorer.egem.io/tx/" +hash+ ")")
              message.reply({embed})
              console.log("Withdrawal Processed: " + hash)
      		}

      	})
      	.on('error', console.error);
      }

      sendCoins(address,y,message,name);

    })


  })


}
