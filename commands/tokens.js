const Web3 = require("web3");
const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
var getJSON = require('get-json');
var functions = require('../func/main.js');
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

var theTokens = [
  "0xa1c036a1b083dd9d9ea8427dca4c1d53f089be57", //0xbtc
  "0x0c5106dc60033c5ac6ec3d504883c451265e7560", //ndr
  "0xd13f1e4ba5a631cb0dc53cb31ff05218864f861e"  //jal
];

exports.run = (client, message, args) => {
  if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");

  const author = message.author.id;

  // The minimum ABI to get ERC20 Token balance
  let minABI = [
    // balanceOf
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    },
    // decimals
    {
      "constant":true,
      "inputs":[],
      "name":"decimals",
      "outputs":[{"name":"","type":"uint8"}],
      "type":"function"
    }
  ];

  function delay() {
  	return new Promise(resolve => setTimeout(resolve, 1000));
  }

  async function delayedLog(item) {
  	// await promise return
  	await delay();
  	// log after delay

    con.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
      connection.query("SELECT * FROM data WHERE userId = ?", author, function (err, result) {
        if (err) return message.reply("No Results.");
        try {
          let parsed = JSON.stringify(result);
          let obj = JSON.parse(parsed);
          let address = obj[0]["address"];

          var mytest = new web3.eth.Contract(minABI, item, {
              from: address, // default from address
              gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
          });

          if (item == "0xa1c036a1b083dd9d9ea8427dca4c1d53f089be57") {
            var name = "0xBtc";
          } else if (item == "0x0c5106dc60033c5ac6ec3d504883c451265e7560") {
            var name = "NDR";
          } else if (item == "0xd13f1e4ba5a631cb0dc53cb31ff05218864f861e") {
            var name = "JAL";
          }

          mytest.methods.balanceOf(address).call()
              .then(function(result){
              //the result holds your Token Balance that you can assign to a var
              var myTokenBalance = result;
              message.reply("You have: "+result/Math.pow(10,18) + " - " + name + " | Tokens");
          });
          console.log(item);
        } catch (e) {
          console.log(e);
        }

      })
      connection.release();
    })
  }

  async function processArray(array) {
  	for (const item of array) {
  		await delayedLog(item);
  	}
  	console.log("Done");
  }

  processArray(theTokens);

}
