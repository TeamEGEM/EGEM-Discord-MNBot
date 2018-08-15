
const Discord = require("discord.js");
const miscSettings = require("../configs/settings.json");

exports.run = (client, message, args) => {
  const embed = new Discord.RichEmbed()
    .setTitle("EGEM Discord Bot.")
    .setAuthor("TheEGEMBot", miscSettings.egemspin)

    .setColor(miscSettings.okcolor)
    .setDescription("Official EGEM Pool List:")
    .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
    .setThumbnail(miscSettings.img32shard)

    .setTimestamp()
    .setURL("https://github.com/TeamEGEM/EGEM-Bot")
    .addField("EGEM DEV Pool", "https://pool.egem.io/")
    .addField("Minerpool.net (US/EU/ASIA)", "http://egem.minerpool.net/")
    .addField("CoMining.io (US/EU/ASIA)", "https://comining.io/")
    .addField("Protonmine", "http://egem.protonmine.io/")
    .addField("Coins.Farm", "https://coins.farm/pools/egem/")
    .addField("Clona.ru SOLO POOL", "http://clona.ru/")
    .addField("CUBEPOOL.EU", "https://egem.cubepool.eu/")
    .addField("PoolFun Multi", "http://poolfun.ru/")

    message.channel.send({embed})
}