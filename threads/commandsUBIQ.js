"use strcit";

// Settings and Requires
var getJSON = require('get-json');
var _ = require('lodash');
const Web3 = require("web3");
const Discord = require("discord.js");
const BigNumber = require('bignumber.js');
const fs = require("fs-extra");
const randomWord = require('random-word');
require('console-color-mr');

const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");

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
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3providerubiq));

const prefix = miscSettings.prefix;
const bot = new Discord.Client({disableEveryone:true});

bot.on('ready', ()=>{
	console.debug("**COMMAND THREAD** is now Online.");
	//bot.channels.get(botChans.botChannelId).send("**COMMAND THREAD** is now **Online.**");
});

// Thread console heartbeat
const threadHB = function sendHB(){
	console.debug("**COMMAND THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);

// Function to turn files into commands.
bot.on("message",async message => {

  if(message.author.bot) return;
  if(message.content.indexOf(miscSettings.prefix) !== 0) return;

  // This is the best way to define args. Trust me.
  const args = message.content.slice(miscSettings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  if(message.content.startsWith(prefix + "ubiqbal")){
    let address = args[0];

      await web3.eth.getBalance(address, (error,result)=>{
        if(!error){
          console.log(result);
          var balance = (result/Math.pow(10,18)).toFixed(3);
          if(balance > 0){
            message.channel.send(`This balance has: **${balance}**`);
          } else if(balance == 0){
            message.channel.send(`This balance empty, it has: **${balance}**`);
          } else {
            message.channel.send(`Your balance is **${balance}**`);
          }
        } else {
          console.log(error)
          message.channel.send("Oops, some problem occured with your address.");
        }
      })

  }
});

bot.on('error', console.error);
// Login the bot.
bot.login(botSettings.token);
