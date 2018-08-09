const Discord = require("discord.js");
const botSettings = require("../configs/config.json");
const miscSettings = require("../configs/settings.json");
const botChans = require("../configs/botchans.json");
const prefix = miscSettings.prefix;

exports.run = (client, message, args) => {
  if(!message.member.hasPermission('ADMINISTRATOR')){
    return message.channel.send("You cannot use '/purge' command.");
  }
  const user = message.mentions.users.first();
  const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
  if (!amount) return message.reply('Must specify an amount to delete!');
  if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
  message.channel.fetchMessages({
   limit: amount,
  }).then((messages) => {
   if (user) {
   const filterBy = user ? user.id : Client.user.id;
   messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
   }
   message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
  });
}
