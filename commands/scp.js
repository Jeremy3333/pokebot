const fs = require('fs');
const Discord = require("discord.js");
var cache = {}
async function collect(r, scp, msg) {
  const mongo = require("../mongo");
  const scpTimeSchema = require('../schemas/scp-time')
  const scpSchema = require('../schemas/scp-schema')

  // Fetch user id from emoji
  e = await r.users.cache.map(u => u.toString())
  e = e[0].slice(2, -1)

  // Get the user claim left
  await mongo().then(async (mongoose) => {
    try {
      const result = await scpTimeSchema.findOne({ _id: e });
      if(result != null){
        rollData = result;
      } else {
        rollData = {_id: id, roll:10, rollTime: Date.now(), claimTime: 0}
      }
    } finally {
      mongoose.connection.close();
    }
  });

  // Check if the claim time is over
  let claimTimer = Date.now() - rollData.claimTime
  if(claimTimer <= 3600000) {
    return msg.channel.send(`You have already claim please wait ${Math.round(60 - ((claimTimer / 1000) / 60))} minutes`)
  }

  // Reset timer
  rollData.claimTime = Date.now()

  // Push the new timer
  await mongo().then(async mongoose => {
    try {
      await scpTimeSchema.findOneAndUpdate({
        _id: e
      }, rollData, {
        upsert: true,
        useFindAndModify: false
      })
    } finally {
      mongoose.connection.close()
    }
  })

  // Get the user scp
  await mongo().then(async (mongoose) => {
    try {
      const result = await scpSchema.findOne({ _id: e });
      if(result != null){
        data = result.scp;
      } else {
        data = []
      }
    } finally {
      mongoose.connection.close();
    }
  });

  // Check if the user have this scp
  if (!data.find(element => element.toString() === scp.id.toString())){
    data.push(scp.id)
  } else {
    return msg.channel.send("you already have this scp")
  }

  // Push the new scp
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
    const mongo = require("../mongo");
    const scpTimeSchema = require('../schemas/scp-time')
    const { id } = message.author

    // Get the user rolls counter
    await mongo().then(async (mongoose) => {
      try {
        const result = await scpTimeSchema.findOne({ _id: id });
        if(result != null){
          rollData = result;
        } else {
          rollData = {_id: id, roll:10, rollTime: Date.now(), claimTime: 0}
        }
      } finally {
        mongoose.connection.close();
      }
    });

    // check roll counter
    let rollTimer = Date.now() - rollData.rollTime
    if(rollData.roll === 0){
      if (rollTimer <= 3600000){
        return message.channel.send(`You don't have roll left please wait ${Math.round(60 - ((rollTimer / 1000) / 60))} minutes`)
      } else {
        rollData.roll = 10
        rollData.rollTime = Date.now()
      }
    }

    // Remove 1 from the counter
    rollData.roll--;

    // Push the new counter
    await mongo().then(async mongoose => {
      try {
        await scpTimeSchema.findOneAndUpdate({
          _id: id
        }, rollData, {
          upsert: true,
          useFindAndModify: false
        })
      } finally {
        mongoose.connection.close()
      }
    })

    // Read data from scp.json and choose an scp
    let rawdata = fs.readFileSync('./json/scp.json');
    let SCP = JSON.parse(rawdata);
    let num = Math.floor(Math.random() * SCP.scp.length);
    SCP = SCP.scp[num]

    // Create and send the embed
    const embed = new Discord.MessageEmbed()
      .setTitle(SCP.index)
      .setURL(SCP.link)
      .setFooter(`request by ${message.author.tag}, you have ${rollData.roll} rolls left.`, message.author.avatarURL())
      .setColor("#000")
    	.setImage(SCP.img)
      .addFields({ name: 'Object Class', value: SCP.class })

      
    const embed2 = new Discord.MessageEmbed()
      .setTitle(SCP.index)
      .setURL(SCP.link)
      .setFooter(`request by ${message.author.tag}, you have ${rollData.roll} rolls left.`, message.author.avatarURL())
      .setColor("#FB4949")
      .setImage(SCP.img)
      .addFields({ name: 'Object Class', value: SCP.class })
    const msg = await message.channel.send(embed)
    await msg.react("⛓️")

    // Collect emoji
    const filter = () => 2 == 2;
    const collector = msg.createReactionCollector(filter, { time: 15000, max: 1 });
    collector.on('collect', r => collect(r, SCP, msg));
    collector.on('end', r => msg.edit(embed2))
  },
};