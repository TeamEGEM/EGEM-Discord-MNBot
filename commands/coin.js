
const Discord = require("discord.js");
const miscSettings = require("../configs/settings.json");
var getJSON = require('get-json');

exports.run = (client, message, args) => {
  var btcPrice = getJSON('https://api.egem.io/api/v1/egem_prices', function(error, response){
		if(!error) {
      var supply = response["TOTAL_EGEM_SUPPLY"];
      var avgUSD = response["AVERAGEUSD"];
      var mcap = supply*avgUSD;

      const embed = new Discord.RichEmbed()
        .setTitle("EGEM Discord Bot.")
        .setAuthor("TheEGEMBot", miscSettings.egemspin)

        .setColor(miscSettings.okcolor)
        .setDescription(":ledger: Coin Status:")
        .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
        .setThumbnail(miscSettings.img32shard)

        .setTimestamp()
        .setURL("https://github.com/TeamEGEM/EGEM-Bot")
        .addField("Total Supply:", supply+" EGEM")
        .addField("Market Cap:", Number(mcap).toFixed(2)+" USD")
        .addField("Average Price:", Number(avgUSD).toFixed(4)+" USD")

        message.channel.send({embed})
		} else {
			console.log('**EGEM BOT** MARKET API ISSUE!');
		}
	})
}
