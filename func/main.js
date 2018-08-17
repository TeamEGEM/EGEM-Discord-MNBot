// Settings and Requires
var getJSON = require('get-json');
var _ = require('lodash');
const Web3 = require("web3");
const Discord = require("discord.js");
const BigNumber = require('bignumber.js');
const fs = require("fs-extra");
var async = require("async");
var mysql = require('mysql');

const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
// EtherGem web3
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

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

async function getBalance(address){
  let balance = await web3.eth.getBalance(address);

  return balance;
}

// exports the variables and functions above so that other modules can use them
module.exports.numberToString = numberToString;
module.exports.getBalance = getBalance;
