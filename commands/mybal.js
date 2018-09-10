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

//ranks

exports.run = (client, message, args) => {
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
    return;
  }
  var user = message.author.username;
  var author = message.author.id;

  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT avgusd FROM pricedata WHERE id = '0'", function (err, result1) {
      if (err) return message.reply("No Results.");
      let parsed1 = JSON.stringify(result1);
      let obj1 = JSON.parse(parsed1);

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
          let autoWithdrawals = obj[0]["autoWithdrawal"];
          if (authorCheck == author) {
            if (author == authorCheck) {
              //console.log(obj);
              var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + address, function(error, response){
                if(!error) {
                  var amount2 = response["BALANCE"];
                  //connection.query(`UPDATE data SET balance = ? WHERE userId = ?`, [amount, row.userId]);
                  //return message.reply("you have " + amount2 + " EGEM (LIVE) | " + amount + " EGEM (DB)" + " | Cheated: " + hasCheated + " | Earning: " + canEarn);
                  talkedRecently.add(message.author.id);
                  setTimeout(() => {
                    // Removes the user from the set after 2.5 seconds
                    talkedRecently.delete(message.author.id);
                  }, 120000);
                  if (betaTester == "Yes") {
                    var theflag = "Beta Tester:"
                    var themsg = "Thank you for helping at the start! :tada:"
                  } else {
                    var theflag = "Normal User:"
                    var themsg = "Thank you for signing up!"
                  }
                  var title = "null";
                  var balance = amount2;
                  if(balance >= 1000000){
                    var title = "Grand Dragon :dragon:";
                    var next = "You are at MAX rank.";
                  } else if(balance >= 500000){
                    var title = "Unicorn :unicorn:";
                    var next = "1000000 EGEM";
                  } else if(balance >= 250000){
                    var title = "Humpback Whale :whale:";
                    var next = "500000 EGEM";
                  } else if(balance >= 150000){
                    var title = "Elephant :elephant:";
                    var next = "250000 EGEM";
                  } else if(balance >= 75000){
                    var title = "Killer Whale :whale2:";
                    var next = "150000 EGEM";
                  } else if(balance >= 50000){
                    var title = "Turtle :turtle:";
                    var next = "75000 EGEM";
                  } else if(balance >= 25000){
                    var title = "Shark :shark:";
                    var next = "50000 EGEM";
                  } else if(balance >= 15000){
                    var title = "Crocodile :crocodile:";
                    var next = "25000 EGEM";
                  } else if(balance >= 7500){
                    var title = "Dolphin :dolphin:";
                    var next = "15000 EGEM";
                  } else if(balance >= 5000){
                    var title = "Puffer Fish :blowfish:";
                    var next = "7500 EGEM";
                  } else if(balance >= 2500){
                    var title = "Octopus :octopus: ";
                    var next = "5000 EGEM";
                  } else if(balance >= 1000){
                    var title = "Snow Crab :crab:";
                    var next = "2500 EGEM";
                  } else if(balance >= 500){
                    var title = "Shrimp :shrimp:";
                    var next = "1000 EGEM";
                  } else if(balance >= 50){
                    var title = "Plankton :seedling:";
                    var next = "500 EGEM";
                  } else if(balance == 0){
                    var title = "This balance is empty. :x:";
                    var next = "50 EGEM";
                  } else {
                    var title = ":space_invader: You require more EGEM.";
                    var next = "50 EGEM";
                  }
                  //var amount3 = (amount2*Math.pow(10,18));
                  //console.log(functions.numberToString(amount3));

                  //console.log(obj1[0]["avgusd"]);

                  var price = obj1[0]["avgusd"];
                  var usdValue = (Number(price) * Number(amount2));
                  //console.log(usdValue);
                  connection.query(`UPDATE data SET balance =? WHERE userId = ?`, [amount2,author]);
                  connection.release();
                  const embed = new Discord.RichEmbed()
                    .setTitle("EGEM Discord Bot.")
                    .setAuthor("TheEGEMBot", miscSettings.egemspin)

                    .setColor(miscSettings.okcolor)
                    .setDescription("EGEM User Status Info:")
                    .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
                    .setThumbnail(miscSettings.img32shard)

                    .setTimestamp()
                    .setURL("https://github.com/TeamEGEM/EGEM-Bot")
                    .addField("Registered Address:", "["+address+"](https://explorer.egem.io/addr/"+address+")")
                    .addField("Quarry #1: ", "is "+isOnline, true)
                    .addField("Quarry #2: ", "is "+isOnline2, true)
                    .addField("Quarry Registered: ", regTxSent)
                    .addField("EGEM Rank: ", title, true)
                    .addField("Next Rank: ", next, true)
                    .addField("EGEM Balance: ", "💳 = "+amount2+ " EGEM." + " | Est. Value: $ " + usdValue)
                    .addField("EGEM Credits: ", "💰 = "+creditsT+ " EGEM.")
                    .addField("Amount Withdrawn: ", (numberOfWDAmount/Math.pow(10,18))+ " EGEM in "+ numberOfWD +" Withdrawals")
                    .addField("Auto Withdrawals Enabled: ", autoWithdrawals)
                    .addField("Status: "+theflag, themsg)
                    .addField("Nodes Earning: ", canEarn, true)
                    .addField("Last Node Pay: ", (myPay/Math.pow(10,18))+ " EGEM.", true)
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

  })
}
