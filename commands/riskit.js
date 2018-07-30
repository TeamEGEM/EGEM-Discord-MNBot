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
const talkedRecently = new Set();

exports.run = (client, message, args) => {
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
    return;
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    //connection.query(`UPDATE settings SET motd =? WHERE id = 1`, editedMOTD);
    //console.log('Message saved!');
    message.reply("Game not online!");
    // Adds the user to the set so that they can't talk for 2.5 seconds
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      // Removes the user from the set after 2.5 seconds
      talkedRecently.delete(message.author.id);
    }, 120000);
  })

}
