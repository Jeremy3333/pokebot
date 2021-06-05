module.exports = {
  commands: ["setwelcome", "sw"],
  expectedArgs: "<message></message>",
  permissionError: "You need admin permission to run this command",
  minArgs: 1,
  callback: async (message, arguments, text) => {
    
    const mongo = require("../mongo");
    const welcomeSchema = require("../schemas/welcome-schemas")
    const argument = arguments.join(" ")
    const { guild, channel } = message

    await mongo().then(async mongoose => {
      try {
        await welcomeSchema.findOneAndUpdate({
          _id: guild.id
        }, {
          _id: guild.id,
          channelId: channel.id,
          text: argument,
        }, {
          upsert: true,
          useFindAndModify: false
        })
      } finally {
        mongoose.connection.close()
      }
    })
  },
  permissions: [
    "ADMINISTRATOR",
    "MANAGE_GUILD"
  ],
};
