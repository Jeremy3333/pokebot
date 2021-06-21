module.exports = {
  commands: ["add", "addition"],
  description: "Add two numbre together (Admin command)",
  expectedArgs: "<num1> <num2>",
  permissionError: "You need admin permission to run this command",
  minArgs: 2,
  maxArgs: 2,
  callback: (message, arguments, text) => {
    message.channel.send(`the sum is ${(+arguments[0])+(+arguments[1])}`)
  },
  permissions: "ADMINISTRATOR",
  requiredRoles: [],
};
