let cache = {}
module.exports = {
  commands: "sj",
  callback: (message, arguments, text) => {
    
const welcomeSchemas = require("../schemas/welcome-schemas");
const mongo = require("../mongo");
    const onJoin = async member => {
      const { guild } = member;
      let data = cache[guild.id];
      if (!data) {
      console.log("FETCHING FROM DATABASE");
      await mongo().then(async (mongoose) => {
        try {
          const result = await welcomeSchemas.findOne({ _id: guild.id });
          cache[guild.id] = data = [result.channelId, result.text];
        } finally {
          mongoose.connection.close();
        }
      });
    }
    const channelId = data[0];
    const text = data[1];

    const channel = guild.channels.cache.get(channelId);
    channel.send(text);
  }
  onJoin(message.member)
  },
  permissions: "ADMINISTRATOR",
  requiredRoles: [],
  };
  