const fs = require("fs");
const Discord = require("discord.js");
async function help(r, msg, embedStat, orgCommands, message){
  // Check what reaction was add
  if(r._emoji.name === "➡️") {
    if(embedStat >= orgCommands.length - 1){
      embedStat = 0
    } else {
      embedStat++
    }
  } else if(r._emoji.name === "⬅️"){
    if (embedStat <= 0){
      embedStat = orgCommands.length - 1
    } else {
      embedStat--
    }
  }

  // Create the new embed and edit the last one
  const embed = new Discord.MessageEmbed()
    .setTitle("Help")
    .setColor("#1EF900")
    .setFooter(`request by ${message.author.tag}`, message.author.avatarURL())
    .addFields(orgCommands[embedStat])
  msg = await msg.edit(embed)

  // Listen to the reaction change
  const filter = () => 2 == 2;
  const collector = msg.createReactionCollector(filter, { time: 15000, max: 1 });
  collector.on('collect', r => help(r, msg, embedStat, orgCommands, message));
}
module.exports = {
  commands: "help",
  description: "Display all of the command",
  callback: async (message, arguments, text) => {
    // Read all the command
    let rawdata = fs.readFileSync('./json/commands.json');
    let commands = JSON.parse(rawdata);

    // Organize the commands
    let orgCommands = [[]]
    let count = 0
    let turn = 0
    commands.commands.forEach(command => {
      count++
      if(count <= 5){
        orgCommands[turn].push({name: command.name, value: command.value})
      } else {
        turn++
        count = 0
        orgCommands.push([])
        orgCommands[turn].push({name: command.name, value: command.value})
      }
    });

    // Create and send the Embed
    const embed = new Discord.MessageEmbed()
      .setTitle("Help")
      .setColor("#1EF900")
      .setFooter(`request by ${message.author.tag}`, message.author.avatarURL())
      .addFields(orgCommands[0])
    const msg = await message.channel.send(embed)
    await msg.react("⬅️")
    await msg.react("➡️")

    // Listen to the reaction change
    const filter = () => 2 == 2;
    const collector = msg.createReactionCollector(filter, { time: 15000, max: 1 });
    let embedStat = 0
    collector.on('collect', r => help(r, msg, embedStat, orgCommands, message));
  },
};
