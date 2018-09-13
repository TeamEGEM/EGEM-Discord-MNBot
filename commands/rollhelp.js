const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
const talkedRecently = new Set();
exports.run = (client, message, args) => {
  if (talkedRecently.has(message.author.id)) {
    message.reply("Wait for the cooldown! 120sec.");
    return;
  }
  const embed = new Discord.RichEmbed()
    .setTitle("EGEM Discord Bot.")
    .setAuthor("TheEGEMBot", miscSettings.egemspin)

    .setColor(miscSettings.okcolor)
    .setDescription("Command List:")
    .setFooter(miscSettings.footerBranding, miscSettings.img32x32)
    .setThumbnail(miscSettings.img32shard)

    .setTimestamp()
    .setURL(miscSettings.ghlink)
    .addField(prefix+"roll", "roll a 6 or higher for a chance at some coins. (FREE ROLL/TIMELIMIT)")
    .addField(prefix+"roll <bet>", "roll a 7 or higher for a chance to double your bet.")

    message.reply({embed})
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      // Removes the user from the set after 2.5 seconds
      talkedRecently.delete(message.author.id);
    }, 120000);
}
