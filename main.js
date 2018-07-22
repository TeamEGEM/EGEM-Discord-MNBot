"use strcit";

// Settings and Requires
var getJSON = require('get-json');
var _ = require('lodash');
const Web3 = require("web3");
const Discord = require("discord.js");
const BigNumber = require('bignumber.js');
const fs = require("fs");
const isopen = require("isopen");
const tcpscan = require('simple-tcpscan');

const botSettings = require("./configs/config.json");
const miscSettings = require("./configs/settings.json");
const botChans = require("./configs/botchans.json");
var mysql = require('mysql');

var con = mysql.createPool({
  connectionLimit : 100,
  host: "localhost",
  user: "root",
  password: botSettings.mysqlpass,
  database: "EGEMTest"
});

// con.connect(function(err) {
//   if (err) throw err;
//   //Select all customers and return the result object:
//   con.query("SELECT * FROM customers", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });

// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

const prefix = miscSettings.prefix;
const bot = new Discord.Client({disableEveryone:true});

bot.on('ready', ()=>{
	console.log("**NODE SYSTEM** is now Online.");
	bot.channels.get(botChans.botChannelId).send("**NODE THREAD** is now **Online.**");
});

// Thread console heartbeat
const threadHB = function sendHB(){
	console.log("**NODE THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);

// Main file bot commands
bot.on('message',async message => {

	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	var message = message;
	let args = message.content.split(' ');

// Register with bot.
  if(message.content.startsWith(prefix + "nodereg ")){

    let address = args[1];
    let ip = args[2];
    let balance = await web3.eth.getBalance(address)/Math.pow(10,18);
    let isOnline = "yes";
    let author = message.author.id;
    let user = message.author.username;

    con.getConnection(function(err, connection) {
      if (err) throw err; // not connected!

      connection.query("SELECT userId FROM data WHERE userId = ?", author, function (err, result) {

        if (err) console.log(err);
        try {
          let parsed = JSON.stringify(result);
          let obj = JSON.parse(parsed);
          let authorCheck = obj[0]["userId"];
          if (authorCheck !== null) {
            if (author == authorCheck) {
              return message.reply("Sorry you have registered already.");
              connection.release();
            };
          }
        }catch(e){
          console.log("ERROR ::",e)
        }

        connection.query('INSERT INTO data (userId, userName, balance, address, ip, isOnline) VALUES (?, ?, ?, ?, ?, ?)', [author, user, balance, address, ip, isOnline]);
        message.reply("You have been added to the database.");
        // When done with the connection, release it.
        connection.release();


        // Handle error after the release.
        if (err) throw err;
        // Don't use the connection here, it has been returned to the pool.
      });
    });

  }

// Check to see if registered.
  if(message.content == prefix + "nodecheck"){

    con.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      let author = message.author.id;
      connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
        if (!result) return message.reply("User Not Registered.");
        let parsed = JSON.stringify(result);
        let obj = JSON.parse(parsed);
        console.log(obj);
        let address = obj[0]["address"];
        let balance = obj[0]["balance"];
        let ip = obj[0]["ip"];
        tcpscan.run({'host': result.ip, 'port': 30666}).then(
          () => {
            message.channel.send("NODE is ONLINE!")
            //sql.run(`UPDATE data SET isOnline ="Online" WHERE userId ="${message.author.id}"`);
          },
          () => {
            message.channel.send("NODE is OFFLINE!")
            //sql.run(`UPDATE data SET isOnline ="Offline" WHERE userId ="${message.author.id}"`)
          }
        );

        message.reply(`Registered to ${address} | Linked to ${ip} | with a balance of ${balance} EGEM.`);
      });

 });
}


// List Nodes.

  if(message.content == prefix + "listnodes"){
    // sql.get(`SELECT * FROM data`).then(row => {
    //   if (!row) return message.reply("Not Registered");
    //
    //   let text = "";
    //   for (const x in row.userId) {
    //       text += row.userId + " ";
    //   }
		// 	let resT = JSON.stringify(text)
		// 	message.channel.send(resT);
    // });
  }

})


// Login the bot.
bot.login(botSettings.token);