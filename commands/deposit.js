const Discord = require("discord.js");
const Web3 = require("web3");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var functions = require('../func/main.js');
var mysql = require('mysql');

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

var pool = mysql.createPool({
  connectionLimit : 10,
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb,
  debug: false,
});

const talkedRecently = new Set();
var botAddy = botSettings.address;

exports.run = (client, message, args) => {
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
    return;
  }
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    web3.eth.getTransaction(args[0], (error,result)=>{

    if (result == null) {
      return message.reply("BAD BOY");
    }

    var to = result["to"];
    var from = result["from"];
    var valueRaw = result["value"];
    var minedBlock = result["blockNumber"];

    if (minedBlock == null) {
      const embed = new Discord.RichEmbed()
        .setTitle("EGEM Discord Bot.")
        .setAuthor("TheEGEMBot", miscSettings.egemspin)

        .setColor(miscSettings.warningcolor)
        .setDescription("Bot Deposit:")
        .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
        .setThumbnail(miscSettings.img32shard)

        .setTimestamp()
        .setURL("https://github.com/TeamEGEM/EGEM-Bot")
        .addField("Transaction not mined yet please wait.", "Please try again.")

      return message.channel.send({embed});
    }

    console.log(valueRaw);
    // var value = (valueRaw/Math.pow(10,18)).toFixed(8);
    var hash = args[0];

    let hashStr = hash;
    let fromStr = from.toString();
    let toStr = to.toString();
    let valueStr = valueRaw;

    console.log(toStr);
    if (toStr !== botAddy) {
      return message.reply("You can't claim a transaction that was not sent to the bot.");
    }

    pool.query("SELECT address FROM data WHERE userId = ?", message.author.id, function (err, result) {
      if (err) console.log(err);
      var parsed = JSON.stringify(result);
      var obj = JSON.parse(parsed);
      //console.log(obj[0]['address']);
      var userAddy = obj[0]['address'];
      if (fromStr !== userAddy) {
        return message.reply("You have to send from your registered address to deposit.");
      }
      pool.query("SELECT * FROM txdata WHERE hash = ?", hash, function (err, result) {
        if (err) console.log(err);
        try {
          if (result == "") {

            var query = pool.query("INSERT INTO txdata(`hash`,`from`,`to`,`value`) values(?,?,?,?)",[hash,from,to,valueRaw],function(err, result) {
                //console.log(result);
                pool.query("SELECT * FROM data WHERE userId = ?", message.author.id, function (err, result) {
                  //console.log(result[0]['credits'])
                  var oldBal = parseInt(result[0]['credits']);
                  var newBal = parseInt(valueRaw);
                  var x = Number(oldBal);
                  var y = Number(newBal);
                  var balance = (x + y);
                  var balanceFinal = (balance/Math.pow(10,18)).toFixed(16);
                  connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [functions.numberToString(balance),message.author.id]);
                  message.reply("TX registered. New Balance: " + functions.numberToString(balance) + " WEI | EGEM: " + balanceFinal );
                  sendCoins(address,y,message,name);
                  talkedRecently.add(message.author.id);
                  setTimeout(() => {
                    // Removes the user from the set after 2.5 seconds
                    talkedRecently.delete(message.author.id);
                  }, 120000);
                })

                //console.log(err);
            });
          }

          let parsed = JSON.stringify(result);
          let obj = JSON.parse(parsed);
          console.log(obj);
          let hashCheck = obj[0]["hash"];
          if (hashCheck !== null) {
            if (hash == hashCheck) {
              //console.log(hashCheck);
              return message.reply("TX registered already.");
              return;
            }
          }

        }catch(e){
          console.log("ERROR ::",e)
        }

        // Handle error after the release.
        if (err) throw err;
        // Don't use the connection here, it has been returned to the pool.
      })
    })


  });
})

}
