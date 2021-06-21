const path = require("path");
const cache = {};
const fs = require("fs");
const Discord = require("discord.js");
const commands = { commands: [] };
const client = new Discord.Client();
const { token } = require("./config.json");

const mongo = require("./mongo");
const welcomeSchemas = require("./schemas/welcome-schemas");

const baseFile = "command-base.js";
const commandBase = require(`./commands/${baseFile}`);

client.on("ready", async () => {
  console.log("Hello World !");

  await mongo().then((mongoose) => {
    try {
      console.log("Connected to mongo!");
    } finally {
      mongoose.connection.close();
    }
  });

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file));
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file));
        commandBase(option);
        if (typeof option.commands === "string") {
          commands.commands.push({
            name: option.commands,
            value: option.description,
          });
        } else {
          commands.commands.push({
            name: option.commands[0],
            value: option.description,
          });
        }
      }
    }
  };
  readCommands("commands");
  json = JSON.stringify(commands);
  fs.writeFile("./json/commands.json", json, function (err) {
    if (err) return console.log(err);
  });
  commandBase.listen(client);

  const onJoin = async (member) => {
    const { guild } = member;
    let data = cache[guild.id];
    if (!data) {
      console.log("FETCHING FROM DATABASE");
      await mongo().then(async (mongoose) => {
        try {
          const result = await welcomeSchemas.findOne({ _id: guild.id });
          if (result) {
            cache[guild.id] = data = [result.channelId, result.text];
          }
        } finally {
          mongoose.connection.close();
        }
      });
    }
    if (!data) {
      return;
    }
    const channelId = data[0];
    const text = data[1];

    const channel = guild.channels.cache.get(channelId);
    channel.send(text.replace(/<@>/g, `<@${member.id}>`));
  };
  client.on("guildMemberAdd", async (member) => {
    onJoin(member);
  });
});

client.login(token);
