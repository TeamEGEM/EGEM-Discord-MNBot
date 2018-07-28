const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');

exports.run = (client, message, args) => {
  var address = args[0];
  var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + address, function(error, response){
    if(!error) {
      let amount = response["BALANCE"];
      message.reply("That address contains: " + amount + " EGEM.")
    }
  })
}
