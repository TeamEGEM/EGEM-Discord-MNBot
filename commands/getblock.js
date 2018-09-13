const Web3 = require("web3")
const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(miscSettings.web3provider));

exports.run = (client, message, args) => {
  if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");
  let block = args[0];
  web3.eth.getBlock(args[0], (error,result)=>{
    if(!error){
      if(result !== null){
        let phash = result["parentHash"];
        let hash = result["hash"];
        let number = result["number"];
        let timestamp = result["timestamp"];
        let dt = new Date(timestamp*1000);
        let miner = result["miner"];
        let gasUsed = result["gasUsed"];
        let size = result["size"];
        let nonce = result["nonce"];
        let uncles = result["uncles"];
        const embed = new Discord.RichEmbed()
          .setTitle("EGEM Discord Bot.")
          .setAuthor("TheEGEMBot", miscSettings.egemspin)

          .setColor(miscSettings.okcolor)
          .setDescription("Block Lookup Results:")
          .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
          .setThumbnail(miscSettings.img32shard)

          .setTimestamp()
          .setURL(miscSettings.ghlink)
          .addField("Parent Hash:", phash)
          .addField("Hash:", hash)
          .addField("Number:", "["+number+"](https://explorer.egem.io/block/" +number+ ")")
          .addField("Timestamp:", dt)
          .addField("Gas Used:", gasUsed)
          .addField("Size:", size)
          .addField("Miner:", "["+miner+"](https://explorer.egem.io/addr/" +miner+ ")")
          .addField("Nonce:", nonce)

          message.channel.send({embed})
      } else {
        message.channel.send("Block result was null, might be a malformed attempt, please double check and retry.");
      }
    } else {
      message.channel.send("Oops, a error occurred with your block lookup try again, its /getblock <number>.");
    }
  })
}
