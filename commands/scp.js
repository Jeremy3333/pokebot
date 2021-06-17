const fs = require('fs');
const Discord = require("discord.js");
var cache = {}
async function collect(r, scp, msg) {
  const mongo = require("../mongo");
  const scpSchema = require('../schemas/scp-schema')
  e = await r.users.cache.map(u => u.toString())
  e = e[0].slice(2, -1)
  if(!cache[e]){
    console.log("FETCHING FROM DATABASE");
    await mongo().then(async (mongoose) => {
      try {
        const result = await scpSchema.findOne({ _id: e });
        if(result != null){
          cache[e] = data = result.scp;
        } else {
          data = []
        }
      } finally {
        mongoose.connection.close();
      }
    });
  } else {
    data = cache[e]
  }
  console.log(data)
  if (!data.find(element => element.toString() === scp.id.toString())){
    data.push(scp.id)
  } else {
    return msg.channel.send("you already have this scp")
  }
  await mongo().then(async mongoose => {
    try {
      await scpSchema.findOneAndUpdate({
        _id: e
      }, {
        _id: e,
        scp: data
      }, {
        upsert: true,
        useFindAndModify: false
      })
    } finally {
      r.message.channel.send(`you confined ${scp.index}`)
      mongoose.connection.close()
    }
  })
}
module.exports = {
  commands: ["scp-role", "sr"],
  maxArgs: 0,
  callback: async (message, arguments, text) => {
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
    const msg = await message.channel.send(embed)
    const filter = () => 2 == 2;
    const collector = msg.createReactionCollector(filter, { time: 15000, max: 1 });
    collector.on('collect', r => collect(r, SCP, msg));
  },
};