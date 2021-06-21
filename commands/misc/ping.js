module.exports = {
  commands: "ping",
  description: "Pong!",
  callback: (message, arguments, text) => {
    message.reply('Pong!')
  },
};
