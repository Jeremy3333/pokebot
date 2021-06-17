const fs = require('fs');
const Discord = require("discord.js");
module.exports = {
  commands: ["scp-delete", "sd"],
  expectedArgs: "<SCP>",
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, arguments, text) => {
    const mongo = require("../mongo");
    const scpSchema = require('../schemas/scp-schema');
    let rawdata = fs.readFileSync('./json/scp.json');
    let SCP = JSON.parse(rawdata);
    let search = arguments[0].toLowerCase().replace("scp-", "").replace("scp", "")
    if (`${search}`.length == 1) {
      search = `00${search}`;
    } else if (`${search}`.length == 2) {
      search = `0${search}`;
    }
    search = "SCP-" + search
    let searchId = SCP.scp.find(scp => scp.index === search)
    if(!searchId){
      return message.channel.send("this scp is not found")
    }
    searchId = searchId.id
    authorId = message.author.id
    await mongo().then(async (mongoose) => {
      try {
        const result = await scpSchema.findOne({ _id: authorId });
        if(result != null){
          data = result.scp;
        } else {
          data = []
        }
      } finally {
        mongoose.connection.close();
      }
    });
    if(!data.find(id => id === searchId)){
      return message.channel.send(`You don't have  ${search}`)
    }
    const index = data.indexOf(searchId);
    data.splice(index, 1);
    await mongo().then(async mongoose => {
      try {
        await scpSchema.findOneAndUpdate({
          _id: authorId
        }, {
          _id: authorId,
          scp: data
        }, {
          upsert: true,
          useFindAndModify: false
        })
      } finally {
        message.channel.send(`You release ${search}`)
        mongoose.connection.close()
      }
    })
  },
};
