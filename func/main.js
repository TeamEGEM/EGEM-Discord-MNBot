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
var mysql = require('mysql');

const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));



var con = mysql.createPool({
  connectionLimit : 25,
  host: "localhost",
  user: "root",
  password: botSettings.mysqlpass,
  database: "EGEMTest"
});

// returns data
function getData() {
  return JSON.parse(fs.readFileSync('./data/nodes.txt'));
}

function getStats(address, balance)
{

  const makeRequest = async () => {
    let balQ = await web3.eth.getBalance(address)/Math.pow(10,18);
    //console.log("Address " + address + " has " + balQ );

  }
  makeRequest()
}
function myFunc(callback, args)
{
    //do stuff
    //...
    //execute callback when finished
    callback.apply(this, args);
}

// exports the variables and functions above so that other modules can use them
module.exports.getData = getData;
module.exports.myFunc = myFunc;
module.exports.getStats = getStats;
