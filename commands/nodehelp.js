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
    .addField(prefix+"listnodes", "shows the list of nodes. (ADMINS ONLY)")
    .addField(prefix+"flagcheater", "self explanatory. (ADMINS ONLY)")
    .addField(prefix+"nodereg <egemaddress> <ip>", "register node.")
    .addField(prefix+"nodestats", "shows the status of nodes.")
    .addField(prefix+"change0x <egemaddress>", "change address of your node/registration.")
    .addField(prefix+"changeip <ip>", "change ip of your node/registration.")
    .addField(prefix+"balance <egemaddress>", "check a users balance.")
    .addField(prefix+"mybal", "check own balance.")

    message.channel.send({embed})
}
