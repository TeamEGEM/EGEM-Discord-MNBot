"use strcit";

// Settings and Requires
var getJSON = require('get-json');
var _ = require('lodash');
const Web3 = require("web3");
const Discord = require("discord.js");
const BigNumber = require('bignumber.js');
const fs = require("fs-extra");
const randomWord = require('random-word');

const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

const prefix = miscSettings.prefix;
const bot = new Discord.Client({disableEveryone:true});

bot.on('ready', ()=>{
	console.log("**COMMAND THREAD** is now Online.");
	bot.channels.get(botChans.botChannelId).send("**COMMAND THREAD** is now **Online.**");
});

// Thread console heartbeat
const threadHB = function sendHB(){
	console.log("**COMMAND THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);

// Function to turn files into commands.
bot.on("message", message => {

  if(message.author.bot) return;
  if(message.content.indexOf(miscSettings.prefix) !== 0) return;

  // This is the best way to define args. Trust me.
  const args = message.content.slice(miscSettings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // The list of if/else is replaced with those simple 2 lines:
  try {
    let commandFile = require(`../commands/${command}.js`);
    commandFile.run(bot, message, args);
  } catch (err) {
		console.log("**EGEM BOT** No file for that command, prolly other system in use.")
    //console.error(err);
  }
});

// Login the bot.
bot.login(botSettings.token);
