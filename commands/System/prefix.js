const Command = require("../../util/Command.js");

class Prefix extends Command {
    constructor(client) {
        super(client, {
            name: "prefix",
            description: "Returns my command prefix/invoker for the current server.",
            category: "System",
            usage: "prefix",
            aliases: ["invoker"],
            guildOnly: true
        });
    }

    async run(message, args, level) { 
        message.channel.send(`My prefix here on ${message.guild.name} is "**${this.client.settings.prefix}**".\nTo change my prefix, do \`${this.client.settings.prefix}set edit prefix [NewPrefix]\`.`);
    }
}

module.exports = Prefix;
