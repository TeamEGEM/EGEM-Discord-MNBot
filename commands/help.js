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
    .addField(prefix+"botreg <egemaddress>", "register with the bot.")
    .addField(prefix+"stats", "shows the status of nodes.")
    .addField(prefix+"paystats", "shows the status of payments.")
    .addField(prefix+"change0x <egemaddress>", "change address of your node/registration.")
    .addField(prefix+"changeip <ip>", "change ip of your node/registration.")
    .addField(prefix+"changeip2 <ip>", "change ip2 of your node/registration.")
    .addField(prefix+"mybal", "check your own balances.")
    .addField(prefix+"balance <egemaddress>", "check a users balance.")
    .addField(prefix+"deposit <transactionHash>", "deposit to credits.")
    .addField(prefix+"withdrawal <value>", "claim earned balance.")
    .addField(prefix+"autopay", "turn auto withdrawal on/off. 10 EGEM min.")
    .addField(prefix+"xfer <discordid> <value>", "send/tip an amount to a user.")
    .addField(prefix+"toHex <value>", "encode a message to hex format.")
    .addField(prefix+"fromHex <value>", "decode a message from hex format.")
    .addField(prefix+"coinhelp", "shows the list of EGEM specific commands.")
    .addField(prefix+"gamehelp", "shows the list of EGEM games.")
    .addField(prefix+"adminhelp", "commands for admins only.")

    message.reply({embed})
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      // Removes the user from the set after 2.5 seconds
      talkedRecently.delete(message.author.id);
    }, 120000);
}
