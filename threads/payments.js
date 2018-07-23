"use strcit";

// Settings and Requires
var getJSON = require('get-json');
var _ = require('lodash');
const Web3 = require("web3");
const Discord = require("discord.js");
const BigNumber = require('bignumber.js');
const fs = require("fs-extra");
const isopen = require("isopen");
const tcpscan = require('simple-tcpscan');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var async = require("async");



const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
var mysql = require('mysql');

var con = mysql.createPool({
  connectionLimit : 25,
  host: "localhost",
  user: "root",
  password: botSettings.mysqlpass,
  database: "EGEMTest"
});

// Update Node List: Online/Offline and balance
function getNodes(){ return JSON.parse(fs.readFileSync('./data/nodes.txt'));}
// List of functions needed.
// -register (done)
// -check reg (done)
// -listnodes (done)
// -update online/offline (done)
// -check if online more than X amount of time and has X balance.
// -keep track of payments / return payment stats based on registered nodes.
// -find a way to export data for extra stats/functions.
// -increment balance owed
// -calculate users balance
// -send coins

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

const prefix = miscSettings.prefix;
const bot = new Discord.Client({disableEveryone:true});

bot.on('ready', ()=>{
	console.log("**NODE SYSTEM** is now Online.");
	bot.channels.get(botChans.botChannelId).send("**PAYMENTS THREAD** is now **Online.**");
});

// Thread console heartbeat
const threadHB = function sendHB(){
	console.log("**PAYMENTS THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);




// Number to string work around for bignumber and scientific-notation.
function numberToString(num){
    let numStr = String(num);

    if (Math.abs(num) < 1.0)
    {
        let e = parseInt(num.toString().split('e-')[1]);
        if (e)
        {
            let negative = num < 0;
            if (negative) num *= -1
            num *= Math.pow(10, e - 1);
            numStr = '0.' + (new Array(e)).join('0') + num.toString().substring(2);
            if (negative) numStr = "-" + numStr;
        }
    }
    else
    {
        let e = parseInt(num.toString().split('+')[1]);
        if (e > 20)
        {
            e -= 20;
            num /= Math.pow(10, e);
            numStr = num.toString() + (new Array(e + 1)).join('0');
        }
    }

    return numStr;
}

// Main sending function.
function sendCoins(address,value,message,name){
	web3.eth.sendTransaction({
	    from: botSettings.address,
	    to: address,
	    gas: web3.utils.toHex(miscSettings.txgas),
	    value: numberToString(value)
	})
	.on('transactionHash', function(hash){
		// sent pm with their tx
		// recive latest array
		if(name != 1){
      console.log("Payment sent: " + hash);
		} else {
      console.log("Payment sent: " + hash);
		}

	})
	.on('error', console.error);
}

const payNodes = function sendPay(){
  var amount = Number(0.0001);
  var weiAmount = amount*Math.pow(10,18);
  var data = getNodes();
  var message = "Enjoy the EGEM.";
  Object.keys(data).forEach(function(key) {
    var row = data[key];
    var address = row.address;
    var name = row.userName;
    var hasCheated = row.hasCheated;
    var canEarn = row.canEarn;
    if (hasCheated == "Yes" || canEarn == "No") {
        console.log("No payment for user.");
        return;
    }
    sendCoins(address,weiAmount,message,name);
  })
  // main func
  //raining(amount,message);
  console.log("**PAYMENTS SENT**");
};
setInterval(payNodes,miscSettings.PayDelay);


// Main file bot commands
bot.on('message',async message => {

	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	var message = message;
	let args = message.content.split(' ');




// End
})



// Login the bot.
bot.login(botSettings.token);
