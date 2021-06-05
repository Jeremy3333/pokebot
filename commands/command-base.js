const { prefix } = require("../config.json");

const validatePermissions = (permissions) => {
  const validPermission = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAME",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
    "USE_SLASH_COMMANDS",
    "REQUEST_TO_SPEAK",
    "MANAGE_THREADS",
    "USE_PUBLIC_THREADS",
    "USE_PRIVATE_THREADS",
  ];
  for (const permission of permissions) {
    if (!validPermission.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`);
    }
  }
};

module.exports = (client, commandOptions) => {
  let {
    commands,
    expectedArgs = "",
    permissionError = "You do not have permission to run this command.",
    minArgs = 0,
    maxArgs = null,
    permissions = [],
    requiredRoles = [],
    callback,
  } = commandOptions;
  
  // Ensure the command and aliases are in an array
  if (typeof commands === "string") [(commands = [commands])];

  console.log(`Registering command "${commands[0]}"`)

  // ensure all the permission are in an array and are valide
  if (permissions.length) {
    if (typeof permissions === "string") [(permissions = [permissions])];
    validatePermissions(permissions);
  }

  // Listen for messages
  client.on("message", (message) => {
    const { member, content, guild } = message;
    for (const alias of commands) {
      if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {
        // A command has been ran

        //Ensure the user has the required permission
        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            message.reply(permissionError);
            return;
          }
        }

        // Ensure the user has the required role
        for (const requiredRole of requiredRoles) {
          const role = guild.roles.cache.find(
            (role) => role.name === requiredRole
          );
          if (!role || !member.roles.cache.has(role.id)) {
            message.reply(
              `You must have the "${requiredRole}" role to use this command.`
            );
            return;
          }
        }

        // Split on any number of spaces
        const arguments = content.split(/[ ]+/)

        // Remove the command which is the first index
        arguments.shift()

        // Ensure we have the correct numbre of arguments
        if (arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)) {
          message.reply(`Incorrect syntax! Use "${prefix}${alias} ${expectedArgs}"`)
          return
        }

        // Handle the custom command code
        callback(message,arguments)

        return;
      }
    }
  });
};
