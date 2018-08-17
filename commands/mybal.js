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

const talkedRecently = new Set();

exports.run = (client, message, args) => {
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
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
        let isOnline2 = obj[0]["isOnline2"];
        let creditsRaw = obj[0]["credits"];
        let betaTester = obj[0]["betaTester"];
        var BN = web3.utils.BN;
        let creditsBN = new BN(creditsRaw).toString();
        let creditsT = web3.utils.fromWei(creditsBN, 'ether');
        var credits = (creditsT/Math.pow(10,18)).toFixed(16);
        let nodeBonusPay = obj[0]["nodeBonusPay"];
        let numberOfWD = obj[0]["numberOfWD"];
        let numberOfWDAmount = obj[0]["numberOfWDAmount"];
        let myPay = obj[0]["myPay"];
        let ip = obj[0]["ip"];
        let ip2 = obj[0]["ip2"];
        if (authorCheck == author) {
          if (author == authorCheck) {
            connection.release();
            //console.log(obj);
            var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + address, function(error, response){
              if(!error) {
                var amount2 = response["BALANCE"];
                //return message.reply("you have " + amount2 + " EGEM (LIVE) | " + amount + " EGEM (DB)" + " | Cheated: " + hasCheated + " | Earning: " + canEarn);
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                  // Removes the user from the set after 2.5 seconds
                  talkedRecently.delete(message.author.id);
                }, 120000);
                if (betaTester == "Yes") {
                  var theflag = "Beta Tester:"
                  var themsg = "Thank you for helping at the start!"
                } else {
                  var theflag = "Normal User:"
                  var themsg = "Thank you for signing up!"
                }
                const embed = new Discord.RichEmbed()
                  .setTitle("EGEM Discord Bot.")
                  .setAuthor("TheEGEMBot", miscSettings.egemspin)

                  .setColor(miscSettings.okcolor)
                  .setDescription("EGEM User Status Info:")
                  .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
                  .setThumbnail(miscSettings.img32shard)

                  .setTimestamp()
                  .setURL("https://github.com/TeamEGEM/EGEM-Bot")
                  .addField("Registered Address:", "["+address+"](https://explorer.egem.io/addr/" +address+ ")")
                  .addField("Quarry #1 IP: ", "is "+ isOnline, true)
                  .addField("Quarry #2 IP: ", "is "+ isOnline2, true)
                  .addField("Quarry Registered: ", regTxSent, true)
                  .addField("Flagged for Cheating: ", hasCheated, true)
                  .addField("EGEM Balance: ", "💳 = "+amount2+ " EGEM.")
                  .addField("Amount Withdrawn: ", (numberOfWDAmount/Math.pow(10,18))+ " EGEM in "+ numberOfWD +" Withdrawals", true)
                  .addField("Nodes Earning: ", canEarn, true)
                  .addField("Node Bonus: ", nodeBonusPay, true)
                  .addField(theflag, themsg)
                  .addField("Last Node Pay: ", (myPay/Math.pow(10,18))+ " EGEM.")
                  .addField("EGEM Credits: ", "💰 = "+creditsT+ " EGEM.")
                  return message.reply({embed});
              } else {
                console.log(error);
              }
            })

          }
        }
      }catch(e){
        console.log("ERROR ::",e)
        connection.release();
        return message.reply("Not registered, use /botreg <address>.");
      }
    })
  })
}
