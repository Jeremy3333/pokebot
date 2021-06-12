const fs = require('fs');
const Discord = require("discord.js");

module.exports = {
  commands: ["scp-role", "sr"],
  maxArgs: 0,
  callback: (message, arguments, text) => {
    let rawdata = fs.readFileSync('./json/scp.json');
    let SCP = JSON.parse(rawdata);
    let num = Math.floor(Math.random() * SCP.scp.length);
    SCP = SCP.scp[num]
    const embed = new Discord.MessageEmbed()
      .setTitle(SCP.index)
      .setURL(SCP.link)
      .setFooter(`request by ${message.author.tag}`, message.author.avatarURL())
      .setColor("#000")
    	.setImage(SCP.img)
      .addFields({ name: 'Object Class', value: SCP.class })
    message.channel.send(embed);
  },
};