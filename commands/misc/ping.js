module.exports = {
  commands: "ping",
  callback: (message, arguments, text) => {
    message.reply('Pong!')
  },
};
