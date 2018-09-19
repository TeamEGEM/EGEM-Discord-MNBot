const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;
const talkedRecently = new Set();
exports.run = (client, message, args) => {
  if(message.channel.name != '👾-the-egem-bot') return message.reply("Please use in the-egem-bot channel ONLY!");
  if(!message.member.hasPermission('ADMINISTRATOR')){
    return message.channel.send("You cannot use '/adminhelp' command");
  }
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
    .addField(prefix+"flagcheater <userid> Yes/No", "self explanatory.")
    .addField(prefix+"setreg <userid> Yes/No", "self explanatory.")
    .addField(prefix+"setbeta <userid> Yes/No", "self explanatory.")
    .addField(prefix+"setdailypri <value>", "self explanatory.")
    .addField(prefix+"setdailysec <value>", "self explanatory.")
    .addField(prefix+"setcheck <userid> Yes/No", "self explanatory.")
    .addField(prefix+"setcheck2 <userid> Yes/No", "self explanatory.")
    .addField(prefix+"setnodebonus <userid> 1/0", "self explanatory.")
    .addField(prefix+"setroll Online/Offline", "self explanatory.")
    .addField(prefix+"setbj Online/Offline", "self explanatory.")
    .addField(prefix+"settimetrial Online/Offline", "self explanatory.")
    .addField(prefix+"setriskit Online/Offline", "self explanatory.")

    message.reply({embed})
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      // Removes the user from the set after 2.5 seconds
      talkedRecently.delete(message.author.id);
    }, 120000);
}
