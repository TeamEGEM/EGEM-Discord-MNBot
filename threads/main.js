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
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

const prefix = miscSettings.prefix;
const bot = new Discord.Client({disableEveryone:true});

bot.on('ready', ()=>{
	console.error("**NODE Main SYSTEM** is now Online.");
	//bot.channels.get(botChans.botChannelId).send("**NODE THREAD** is now **Online.**");
});

// Thread console heartbeat
const threadHB = function sendHB(){
	console.error("**NODE Main THREAD** is ACTIVE");
};
setInterval(threadHB,miscSettings.HBDelay);

// Update Node List: Online/Offline and balance
const updateNodes = function queryNodes(){
  con.getConnection(function(err, connection) {
    connection.query("SELECT * FROM data", function (err, result, fields){
      if (!result) return message.reply("No Results.");
      let obj = JSON.stringify(result);
      let parsed = JSON.parse(obj);

      let txdata = result;
      Object.keys(txdata).forEach(function(key) {
        var row = txdata[key];

        if (row.isOnline !== "Online" || row.isOnline !== "Offline") {
          tcpscan.run({'host': row.ip, 'port': 30666}).then(
            () => {
              var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + row.address, function(error, response){
                if(!error) {
                  let amount = response["BALANCE"];
                  var regtx = row.regTxSent;
                  con.getConnection(function(err, connection) {
                    connection.query(`UPDATE data SET balance = ? WHERE userId = ?`, [amount, row.userId]);
                    connection.query(`UPDATE data SET isOnline ="Online" WHERE userId = ?`, row.userId);
                    if (regtx == "Yes") {
                      if (amount > 15000 || row.betaTester == "Yes") {
                        connection.query(`UPDATE data SET canEarn ="Yes" WHERE userId = ?`, row.userId);
                      } else {
                        connection.query(`UPDATE data SET canEarn ="No" WHERE userId = ?`, row.userId);
                      }
                    } else {
                      connection.query(`UPDATE data SET canEarn ="No" WHERE userId = ?`, row.userId);
                    }
                    connection.release();
                    console.info("Status: Online. - " + row.userId + " | Node IP: " + row.ip + " | Balance: " + amount + " EGEM." + " | Can Earn: " + row.canEarn);
                  });
                } else {
                  console.log(error);
                }
              })
            },
            () => {
              var userBalance = getJSON('https://api.egem.io/api/v1/balances/?address=' + row.address, function(error, response){
                if(!error) {
                  let amount = response["BALANCE"];
                  con.getConnection(function(err, connection) {
                    connection.query(`UPDATE data SET balance = ? WHERE userId = ?`, [amount, row.userId]);
                    connection.query(`UPDATE data SET isOnline ="Offline" WHERE userId = ?`, row.userId);
                    connection.query(`UPDATE data SET canEarn ="No" WHERE userId = ?`, row.userId);
                    connection.release();
                    console.error("Status: Offline. - " + row.userId + " | Node IP: " + row.ip + " | Balance: " + amount + " EGEM." + " | Can Earn: " + row.canEarn);
                  });
                } else {
                  console.log(error);
                }
              })

            }
          );

        }
      });

      connection.release();
    });
  });

  //let txdata = getNodes();

  console.error("------Node Status Updating:------");
};
setInterval(updateNodes,miscSettings.NodeDelay);


// Main file bot commands
bot.on('message',async message => {

	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
  if(message.channel.name !== 'node-owners') return;

	var message = message;
	let args = message.content.split(' ');

// Register with bot.
  if(message.content.startsWith(prefix + "botreg ")){

    let address = args[1];
    let ip = "192.168.1.66";
    let balance = await web3.eth.getBalance(address)/Math.pow(10,18);
    let isOnline = "Offline";
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


// List Nodes.
  if(message.content == prefix + "listnodes"){
    if(!message.member.hasPermission('ADMINISTRATOR')){
      return message.channel.send("You cannot use '/adminhelp' command");
    }
    con.getConnection(function(err, connection) {
      connection.query("SELECT * FROM data", function (err, result, fields){
        if (!result) return message.reply("No Results.");
        Object.keys(result).forEach(function(key) {
          var row = result[key];
          message.channel.send(" Name: " + row.userName + " | Address: " + row.address + " | UserID: " + row.userId + " | Status: " + row.isOnline);
        });
        connection.release();
      });
    });
  }


// End
})


// Login the bot.
bot.login(botSettings.token);
