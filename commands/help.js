const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
exports.run = (client, message, args) => {
  const embed = new Discord.RichEmbed()
    .setTitle("EGEM Discord Bot.")
    .setAuthor("TheEGEMBot", miscSettings.egemspin)

    .setColor(miscSettings.okcolor)
    .setDescription("Command List:")
    .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
    .setThumbnail(miscSettings.img32shard)

    .setTimestamp()
    .setURL("https://github.com/TeamEGEM/EGEM-Bot")
    .addField(prefix+"ln", "shows the list of nodes.")
    .addField(prefix+"register <address> <ip>", "register node.")
    .addField(prefix+"checkreg", "shows the status of your node/registration.")
    .addField(prefix+"balance <address>", "shows users balance.")

    message.channel.send({embed})
}
