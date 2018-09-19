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
    return message.channel.send("You cannot use '/regcheck' command");
  }
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    var address = args[0];

    connection.query(`
      Select count(*), userId
      from data
      group by userId
      having count(*) > 1
      `, function (err, blacklist) {
      if (err) return console.log(err);
      let parsed = JSON.stringify(blacklist);
      let obj = JSON.parse(parsed);
      console.log(parsed);
      return message.reply(parsed);
    })
    connection.query(`
      Select count(*), address
      from data
      group by address
      having count(*) > 1
      `, function (err, blacklist) {
      if (err) return console.log(err);
      let parsed = JSON.stringify(blacklist);
      let obj = JSON.parse(parsed);
      console.log(parsed);
      return message.reply(parsed);
    })
    connection.query(`
      Select count(*), ip
      from data
      group by ip
      having count(*) > 1
      `, function (err, blacklist) {
      if (err) return console.log(err);
      let parsed = JSON.stringify(blacklist);
      let obj = JSON.parse(parsed);
      console.log(parsed);
      return message.reply(parsed);
    })
    connection.query(`
      Select count(*), ip2
      from data
      group by ip2
      having count(*) > 1
      `, function (err, blacklist) {
      if (err) return console.log(err);
      let parsed = JSON.stringify(blacklist);
      let obj = JSON.parse(parsed);
      console.log(parsed);
      return message.reply(parsed);
    })
    connection.release();
  })

}
