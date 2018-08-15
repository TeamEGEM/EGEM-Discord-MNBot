const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var mysql = require('mysql');
const Web3 = require("web3");
// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

var con = mysql.createPool({
  connectionLimit : 25,
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb
});

exports.run = (client, message, args) => {
  if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");
  let address = args[0];
  let ip = "192.168.1.66";
  let balance = "0";
  let isOnline = "Offline";
  let author = message.author.id;
  let user = message.author.username;
  let addycheck = web3.utils.isAddress(address);
  if (address == null) {
    return message.reply("Please add your address when registering.")
  }
  if (addycheck !== true) {
    return message.reply("Not a valid EGEM address.")
  }
  con.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT userId FROM data WHERE userId = ?", author, function (err, result) {

      if (err) console.log(err);
      try {
        let parsed = JSON.stringify(result);
        let obj = JSON.parse(parsed);
        let authorCheck = obj[0]["userId"];
        if (authorCheck !== null) {
          if (author == authorCheck) {
            return message.reply("Sorry you have registered already.");
            connection.release();
          };
        }
      }catch(e){
        console.log("ERROR ::",e)
      }

      connection.query('INSERT INTO data (userId, userName, balance, address, ip, isOnline) VALUES (?, ?, ?, ?, ?, ?)', [author, user, balance, address, ip, isOnline]);
      message.reply("You have been added to the database, you can now use /mybal to see more info.");
      // When done with the connection, release it.
      connection.release();


      // Handle error after the release.
      if (err) throw err;
      // Don't use the connection here, it has been returned to the pool.
    });
  });

}
