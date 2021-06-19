const fs = require('fs');
const Discord = require("discord.js");
async function list(r, msg, embedStat, f_scp, message){
  // Check what reaction was add
  if(r._emoji.name === "➡️") {
    if(embedStat >= f_scp.length - 1){
      embedStat = 0
    } else {
      embedStat++
    }
  } else if(r._emoji.name === "⬅️"){
    if (embedStat <= 0){
      embedStat = f_scp.length - 1
    } else {
      embedStat--
    }
  }

  // Create the new embed and edit the last one
  const embed = new Discord.MessageEmbed()
    .setTitle("SCP list")
    .setFooter(`request by ${message.author.tag}`, message.author.avatarURL())
    .setColor("#0085FE")
    .addFields(f_scp[embedStat])
  msg = await msg.edit(embed)

  // Listen to the reaction change
  const filter = () => 2 == 2;
  const collector = msg.createReactionCollector(filter, { time: 15000, max: 1 });
  collector.on('collect', r => list(r, msg, embedStat, f_scp, message));
}

module.exports = {
  commands: ["scp-list", "sl"],
  callback: async (message, arguments, text) => {
    const id = message.author.id; 
    const mongo = require("../mongo");
    const scpSchema = require('../schemas/scp-schema');
    let rawdata = fs.readFileSync('./json/scp.json');
    let SCP = JSON.parse(rawdata);

    // Get all the SCP id
    await mongo().then(async (mongoose) => {
      try {
        const result = await scpSchema.findOne({ _id: id });
        if(result != null){
          data = result.scp;
        } else {
          data = []
        }
      } finally {
        mongoose.connection.close();
      }
    });

    // Find the SCP in the json by id
    const { scp } = SCP
    let f_scp = [[]]
    let count = 0
    let turn = 0
    data.forEach(id => {
      count++
      let temp = scp.find(element => element.id === id)
      if(count <= 10){
        f_scp[turn].push({name: temp.index, value: `class ${temp.class}`})
      } else {
        turn++
        count = 0
        f_scp.push([])
        f_scp[turn].push({name: temp.index, value: `class ${temp.class}`})
      }
    });

    // Create a default embed send it and add it reactions
    const embed = new Discord.MessageEmbed()
      .setTitle("SCP list")
      .setFooter(`request by ${message.author.tag}`, message.author.avatarURL())
      .setColor("#0085FE")
      .addFields(f_scp[0])
    const msg = await message.channel.send(embed)
    await msg.react("⬅️")
    await msg.react("➡️")
    
    // Listen to the reaction change
    const filter = () => 2 == 2;
    const collector = msg.createReactionCollector(filter, { time: 15000, max: 1 });
    let embedStat = 0
    collector.on('collect', r => list(r, msg, embedStat, f_scp, message));
  },
};
