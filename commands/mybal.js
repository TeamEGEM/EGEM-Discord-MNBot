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

let commandcooldown = new Set();

exports.run = (client, message, args) => {
  if(commandcooldown.has(message.author.id)) {
  const embed = new Discord.RichEmbed()
    .setTitle("EGEM Discord Bot.")
    .setAuthor("TheEGEMBot", miscSettings.egemspin)

    .setColor(miscSettings.warningcolor)
    .setDescription("Command Delay Check:")
    .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
    .setThumbnail(miscSettings.img32shard)

    .setTimestamp()
    .setURL("https://github.com/TeamEGEM/EGEM-Bot")
    .addField("You need to wait 1 min.", "Thank you.")

    message.channel.send({embed})
    return;
  }
  var user = message.author.username;
  var author = message.author.id;

  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
      if (err) return message.reply("No Results.");
      try {
        let parsed = JSON.stringify(result);
        let obj = JSON.parse(parsed);
        let authorCheck = obj[0]["userId"];
        let amount = obj[0]["balance"];
        let address = obj[0]["address"];
        let canEarn = obj[0]["canEarn"];
        let hasCheated = obj[0]["hasCheated"];
        let regTxSent = obj[0]["regTxSent"];
        let isOnline = obj[0]["isOnline"];
        let creditsRaw = obj[0]["credits"];
        var BN = web3.utils.BN;
        let creditsBN = new BN(creditsRaw).toString();
        let creditsT = web3.utils.fromWei(creditsBN, 'ether');
        var credits = (creditsT/Math.pow(10,18)).toFixed(16);
        let nodePay = obj[0]["nodePay"];
        var nodePayNum1 = parseInt(nodePay);
        var nodePayNum2 = Number(nodePayNum1);
        var nodePayNumFinal = (nodePayNum2/Math.pow(10,18)).toFixed(8);
        let ip = obj[0]["ip"];
        if (authorCheck == author) {
          if (author == authorCheck) {
            connection.release();
            console.log(obj);
            var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + address, function(error, response){
              if(!error) {
                var amount2 = response["BALANCE"];
                //return message.reply("you have " + amount2 + " EGEM (LIVE) | " + amount + " EGEM (DB)" + " | Cheated: " + hasCheated + " | Earning: " + canEarn);
                const embed = new Discord.RichEmbed()
                  .setTitle("EGEM Discord Bot.")
                  .setAuthor("TheEGEMBot", miscSettings.egemspin)

                  .setColor(miscSettings.okcolor)
                  .setDescription("EGEM Address Update:")
                  .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
                  .setThumbnail(miscSettings.img32shard)

                  .setTimestamp()
                  .setURL("https://github.com/TeamEGEM/EGEM-Bot")
                  .addField("Registered Node Address: ", address)
                  .addField("Registered Node IP: ", ip)
                  .addField("Registration Completed: ", regTxSent, true)
                  .addField("Flagged for Cheating: ", hasCheated, true)
                  .addField("LIVE BALANCE: ", amount2, true)
                  .addField("DB BALANCE: ", amount, true)
                  .addField("Credits: ", creditsT, true)
                  .addField("Node Pay: ", nodePayNumFinal, true)
                  .addField("Node is: ", isOnline, true)
                  .addField("Node Earning: ", canEarn, true)

                  return message.channel.send({embed});
                  commandcooldown.add(message.author.id);
                  setTimeout(() => {
                    // Removes the user from the set after a minute
                    commandcooldown.delete(message.author.id);
                  }, miscSettings.cmddelay);
              } else {
                console.log(error);
              }
            })

          }
        }
      }catch(e){
        console.log("ERROR ::",e)
        connection.release();
        return message.reply("Not registered.");
      }
    })
  })
}
