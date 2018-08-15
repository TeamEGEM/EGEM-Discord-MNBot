const Web3 = require("web3")
const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

exports.run = (client, message, args) => {
  let block = args[0];
  web3.eth.getTransaction(args[0], (error,result)=>{
    if(!error){
      if(result !== null){
        let minedBlock = result["blockNumber"];
        let from = result["from"];
        let to = result["to"];
        let valueRaw = result["value"];
        let value = (valueRaw/Math.pow(10,18)).toFixed(8);
        let nonce = result["nonce"];
        const embed = new Discord.RichEmbed()
          .setTitle("EGEM Discord Bot.")
          .setAuthor("TheEGEMBot", miscSettings.egemspin)

          .setColor(miscSettings.okcolor)
          .setDescription("Transaction Lookup Results:")
          .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
          .setThumbnail(miscSettings.img32shard)

          .setTimestamp()
          .setURL("https://github.com/TeamEGEM/EGEM-Bot")
          .addField("Mined in Block:", "["+minedBlock+"](https://explorer.egem.io/block/" +minedBlock+ ")")
          .addField("From:", "["+from+"](https://explorer.egem.io/addr/" +from+ ")")
          .addField("To:", "["+to+"](https://explorer.egem.io/addr/" +to+ ")")
          .addField("Value:", value + " EGEM")
          .addField("Nonce:", nonce)

          message.channel.send({embed})
      } else {
        message.channel.send("Transaction result was null, might be a malformed attempt, please double check and retry.");
      }
    } else {
      message.channel.send("Oops, a error occurred with your tx lookup try again, its /gettx <txhash>.");
    }
  })
}
