
const Discord = require("discord.js");
const miscSettings = require("../configs/settings.json");
var getJSON = require('get-json');

exports.run = (client, message, args) => {
  var btcPrice = getJSON('https://graviex.net/api/v2/tickers/egembtc.json', function(error, response){
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
        .setDescription(":ledger: Graviex Market Data:")
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
        .addField("Quick links:","Direct links to graviex trade page.")
        .addField("Bitcoin Pair", "[EGEM/BTC :scales:](https://graviex.net/markets/egembtc)", true)
        .addField("Ethereum Pair", "[EGEM/ETH :scales:](https://graviex.net/markets/egemeth)", true)

        message.channel.send({embed})
		} else {
			console.log('**EGEM BOT** GRAVIEX MARKET API ISSUE!');
		}
	})
}
