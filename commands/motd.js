const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;

var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 5,
  host: botSettings.mysqlip,
  user: botSettings.mysqluser,
  password: botSettings.mysqlpass,
  database: botSettings.mysqldb
});

exports.run = (client, message, args) => {
  if(!message.member.hasPermission('ADMINISTRATOR')){
    return message.channel.send("You cannot use '/motd' command");
  }
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    var editedMOTD = args.slice(0).join(" ");
    connection.query(`UPDATE settings SET motd =? WHERE id = 1`, editedMOTD);
    //console.log('Message saved!');
    message.reply("Message of the day has been saved!");
  })

}
