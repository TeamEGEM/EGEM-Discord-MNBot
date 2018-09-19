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
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provideregem));

const prefix = miscSettings.prefix;
const bot = new Discord.Client({disableEveryone:true});



// Motd
const motd = function sendMotd(){
	try {
		con.getConnection(function(err, connection) {
		connection.query("SELECT motd FROM settings", function (err, result, fields){
      if (!result) return message.reply("No Results.");
      let obj = JSON.stringify(result);
      let parsed = JSON.parse(obj);
			let data = parsed[0]['motd']
			const embed = new Discord.RichEmbed()
				.setTitle("EGEM Discord Bot.")
				.setAuthor("TheEGEMBot", miscSettings.egemspin)

				.setColor(miscSettings.okcolor)
				.setDescription("Message of the day.")
				.setFooter(miscSettings.footerBranding, miscSettings.img32x32)
				.setThumbnail(miscSettings.img32shard)

				.setTimestamp()
				.setURL(miscSettings.ghlink)
				.addField("News & Updates:", data)
				.addField("Website:", miscSettings.websiteLink + " :pushpin: ")
				.addField("Forums:", miscSettings.forumLink + " :pushpin: ")
				.addField("Looking for Info?:", "We use the forums as a central hub, please register.")
			bot.channels.get(botChans.generalChannelId).send({embed});

		})
		connection.release();
		})
	} catch (e) {
		console.log(e)
	}
};
setInterval(motd,miscSettings.motdDelay);



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
  if(message.channel.type === "dm") return;
  
  // This is the best way to define args. Trust me.
  const args = message.content.slice(miscSettings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // The list of if/else is replaced with those simple 2 lines:
  try {

    let commandFile = require(`../commands/${command}.js`);
    commandFile.run(bot, message, args);

  } catch (err) {
		console.error("**EGEM BOT** No file for that command, prolly other system in use.")
    console.error(err);
  }
  if(message.content.startsWith(prefix + "easteregg")){
    message.reply("Nice find!")
  }

});

bot.on('error', console.error);
// Login the bot.
bot.login(botSettings.token);
