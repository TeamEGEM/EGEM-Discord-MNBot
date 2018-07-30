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
const talkedRecently = new Set();
// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));


exports.run = (client, message, args) => {
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
    return;
  }
  var user = message.author.username;
  var author = message.author.id;
  var person = args[0];
  var value = args[1];
  var feeXferAmount = botSettings.txxferfee;
  var z = Number(feeXferAmount);


  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    //get sender data
    connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
      if (err) return message.reply("No Results.")
      try {
        let parsed = JSON.stringify(result)
        let obj = JSON.parse(parsed)
        let authorCheck = obj[0]["userId"]

        var oldBal = parseInt(result[0]['credits'])
        var newBal = Number(value)

        var ly = (newBal).toString(10)
        var y = web3.utils.toWei(ly, 'ether')
        var balance = functions.numberToString(oldBal)
        var balanceFinal1 = Number(balance - y)
        var balanceFinal = Number(balanceFinal1 - z)
        var balanceFinal2 = functions.numberToString(balanceFinal)
        console.log(balanceFinal)
        if (person == author) {
          return message.reply("You can't send funds to yourself.");
        }
        var ifNeg = Math.sign(newBal);
        if (ifNeg == "-1") {
          return message.reply("You can't transfer a negative amount.");
        }
        if (oldBal < y) {
          return message.reply("You don't have enough to transfer that amount.");
        }
        // check if valid receiver
        connection.query("SELECT * FROM data WHERE userId = ?", person, function (err, result3) {
          if (err) {return message.reply("No Results.")}
          try {
            let parsed3 = JSON.stringify(result3)
            let obj3 = JSON.parse(parsed3)
            var slot = obj3[0]["userId"]
            console.log(slot);
          } catch (e) {
            return message.reply("User Not Registered.");
          }
        })
        // update sender balance
        connection.query(`UPDATE data SET credits =? WHERE userId = ?`, [functions.numberToString(balanceFinal2),message.author.id]);
        //get receiver data and send data report
        connection.query("SELECT * FROM data WHERE userId = ?", person, function (err, result2) {
          if (err) return message.reply("No Results.")
          try {
            let parsed2 = JSON.stringify(result2)
            let obj2 = JSON.parse(parsed2)

            var amountStart = parseInt(result2[0]["credits"])
            var User = functions.numberToString(amountStart)
            var UserFinal = (Number(amountStart) + Number(y));
            var UserFinal2 = functions.numberToString(UserFinal);

            // update receiver balance
            connection.query(`UPDATE data SET credits =? WHERE userId =?`, [UserFinal2,person]);
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              // Removes the user from the set after 2.5 seconds
              talkedRecently.delete(message.author.id);
            }, 120000);
            const embed = new Discord.RichEmbed()
              .setTitle("EGEM Discord Bot.")
              .setAuthor("TheEGEMBot", miscSettings.egemspin)

              .setColor(miscSettings.okcolor)
              .setDescription("Credit Balance Transfer:")
              .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
              .setThumbnail(miscSettings.img32shard)

              .setTimestamp()
              .setURL("https://github.com/TeamEGEM/EGEM-Bot")
              .addField("Value Sent: ☚", (y/Math.pow(10,18)) + " EGEM || " + y + " WEI")
              .addField("Fee Deducted: ☚", (z/Math.pow(10,18)) + " EGEM || " + z + " WEI")
              .addField("Credits Remaining: ✨", (balanceFinal/Math.pow(10,18)) + " EGEM || " + balanceFinal2 + " WEI")

            return message.reply({embed});

          } catch (e) {

          }
        })

      }catch(e){
        console.log("ERROR ::",e)
        connection.release();
        return message.reply("Not registered.");
      }

    })
  })
}
