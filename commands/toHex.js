const Discord = require("discord.js");
const Web3 = require("web3");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provideregem));

exports.run = (client, message, args) => {
  if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");
  message.delete();
  var toHex = args.slice(0).join(" ")
  var hexMessage = web3.utils.toHex(toHex)
  message.reply("Result: " + hexMessage )
  console.log(hexMessage)
}
