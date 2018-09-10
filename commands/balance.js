const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var functions = require('../func/main.js');

exports.run = (client, message, args) => {
  if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");
  var address = args[0];
  if (address == null) {
    return message.reply("Please enter a valid EGEM address to lookup.")
  }

  var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + address, function(error, response){
    if(!error) {
      let amount = response["BALANCE"];
      message.reply("That address contains: " + amount + " EGEM.")
    }
  })
}
