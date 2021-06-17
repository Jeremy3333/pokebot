const fs = require('fs');
const Discord = require("discord.js");
module.exports = {
  commands: ["scp-list", "sl"],
  callback: async (message, arguments, text) => {
    const id = message.author.id; 
    const mongo = require("../mongo");
    const scpSchema = require('../schemas/scp-schema');
    let rawdata = fs.readFileSync('./json/scp.json');
    let SCP = JSON.parse(rawdata);
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
    const { scp } = SCP
    var f_scp = []
    data.forEach(id => {
      var temp = scp.find(element => element.id === id)
      f_scp.push({name: temp.index, value: `class ${temp.class}`})
    });
    console.log(f_scp)
    const embed = new Discord.MessageEmbed()
      .setTitle("SCP list")
      .setFooter(`request by ${message.author.tag}`, message.author.avatarURL())
      .setColor("#0085FE")
      .addFields(f_scp)
    const msg = await message.channel.send(embed)
  },
};
