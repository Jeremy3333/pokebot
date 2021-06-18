const fs = require("fs");
const Discord = require("discord.js");
async function collect(r, entry, msg, embedStat, link, message) {
  if(r._emoji.name === "➡️") {
    if(embedStat >= entry.procedures.length){
      embedStat = 0
    } else {
      embedStat++
    }
  } else if(r._emoji.name === "⬅️"){
    if (embedStat <= 0){
      embedStat = entry.procedures.length
    } else {
      embedStat--
    }
  }

  if (embedStat === 0){  
    const embed = new Discord.MessageEmbed()
      .setTitle(entry.index)
      .setURL(link)
      .setFooter(`request by ${message.author.tag}`, message.author.avatarURL())
      .setColor("#000")
    	.setImage(entry.img)
      .addFields({ name: 'Object Class', value: entry.class })
    msg = await msg.edit(embed)
  } else {
    let proc = entry.procedures[embedStat-1]
    if(proc.name === ''){
      proc.name = '\u200b'
    }
    let embed2 = new Discord.MessageEmbed()
    .setTitle(entry.index)
    .setURL(link)
    .setFooter(`request by ${message.author.tag}`, message.author.avatarURL())
    .setColor("#000")
    .addFields({ name: 'Object Class', value: entry.class },entry.procedures[embedStat-1])
    msg = await msg.edit(embed2)
  }


  const filter = () => 2 == 2;
  const collector = msg.createReactionCollector(filter, { time: 15000, max: 1 });
  collector.on('collect', r => collect(r, entry, msg, embedStat, link, message));
}
module.exports = {
  commands: ["scp-show", "ss"],
  expectedArgs: "<SCP>",
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, arguments, text) => {
    let rawdata = fs.readFileSync('./json/scp.json');
    let SCP = JSON.parse(rawdata);
    let search = arguments[0].toLowerCase().replace("scp-", "").replace("scp", "")
    if (`${search}`.length == 1) {
      search = `00${search}`;
    } else if (`${search}`.length == 2) {
      search = `0${search}`;
    }
    const scraper = require("../json/scrapper-total");
    var link = `http://www.scpwiki.com/scp-${search}`;
    search = "SCP-" + search
    let searchId = SCP.scp.find(scp => scp.index === search)
    if(!searchId){
      return message.channel.send("this scp is not found")
    }
    await scraper(link).then((res) => {
      entry = res;
    });
    const embed = new Discord.MessageEmbed()
      .setTitle(entry.index)
      .setURL(link)
      .setFooter(`request by ${message.author.tag}`, message.author.avatarURL())
      .setColor("#000")
    	.setImage(entry.img)
      .addFields({ name: 'Object Class', value: entry.class })
    const msg = await message.channel.send(embed)
    await msg.react("⬅️")
    await msg.react("➡️")
    const filter = () => 2 == 2;
    const collector = msg.createReactionCollector(filter, { time: 15000, max: 1 });
    let embedStat = 0
    collector.on('collect', r => collect(r, entry, msg, embedStat, link, message));
  },
};
