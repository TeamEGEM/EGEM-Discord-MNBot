
const Discord = require("discord.js");
const miscSettings = require("../configs/settings.json");
var getJSON = require('get-json');

exports.run = (client, message, args) => {
  if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");
  var btcPrice = getJSON('https://maplechange.com/api/v2/tickers/egembtc.json', function(error, response){
		if(!error) {
      var buy = response["ticker"]["buy"];
      var sell = response["ticker"]["sell"];
      var low = response["ticker"]["low"];
      var high = response["ticker"]["high"];
      var last = response["ticker"]["last"];
      var vol = response["ticker"]["vol"];
      var volbtc = response["ticker"]["volbtc"];
      var change = response["ticker"]["change"];
      const embed = new Discord.RichEmbed()
        .setTitle("EGEM Discord Bot.")
        .setAuthor("TheEGEMBot", miscSettings.egemspin)

        .setColor(miscSettings.okcolor)
        .setDescription(":ledger: MapleChange Market Data:")
        .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
        .setThumbnail(miscSettings.img32shard)

        .setTimestamp()
        .setURL(miscSettings.ghlink)
        .addField("Buy", buy+" BTC", true)
        .addField("Sell", sell+" BTC", true)
        .addField("Low", low+" BTC", true)
        .addField("High", high+" BTC", true)
        .addField("Last", last+" BTC", true)
        .addField("Volume", vol+" EGEM", true)
        .addField("Volbtc", volbtc+" BTC", true)
        .addField("Change", change+" %", true)
        .addField("Quick links:","Direct links to Maplechange.com trade page.")
        .addField("Bitcoin Pair", "[BTC/EGEM :scales:](https://maplechange.com/markets/egembtc)", true)
        .addField("Litecoin Pair", "[LTC/EGEM :scales:](https://maplechange.com/markets/egemltc)", true)
        .addField("Ethereum Pair", "[ETH/EGEM :scales:](https://maplechange.com/markets/egemeth)", true)
        .addField("WeyCoin Pair", "[WAE/EGEM :scales:](https://maplechange.com/markets/egemwae)", true)
        .addField("Denarius Pair", "[EGEM/DNR :scales:](https://maplechange.com/markets/dnregem)", true)
        .addField("Shield Pair", "[EGEM/XSH :scales:](https://maplechange.com/markets/xshegem)", true)
        .addField("Vertcoin Pair", "[EGEM/VTC :scales:](https://maplechange.com/markets/vtcegem)", true)

        message.channel.send({embed})
		} else {
			console.log('**EGEM BOT** MAPLECHANGE MARKET API ISSUE!');
		}
	})
}
