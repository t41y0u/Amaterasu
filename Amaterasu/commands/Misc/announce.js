const Command = require("../../util/Command.js");

class Announce extends Command {
    constructor(client) {
        super(client, {
            name: "announce",
            description: "Sends a specified message to a specified channel.",
            category: "Misc",
            usage: "announce <id> <message>",
            aliases: ["send"],
            permLevel: "Server Owner",
            guildOnly: true
        });
    }

    async run(message, args, level) { 
        const id = args[0];
        if (!message.guild.find(c => c.id === id)) return this.client.embed("commonError", message, "A channel with that ID does not exist on this server.");
        const content = args.slice(1).join(" ");
        if (!content) return this.client.embed("commonError", message, "Please provide a message for me to announce.");
        message.guild.channels.get(id)
            .send(content)
            .then(message.react("✅"))
            .catch(error => {
                if (error.message === "Missing Access") return message.channel.send(`I do not have sufficient permissions to send messages in <#${id}>.`);
                this.client.logger.error(err.stack);
                return this.client.embed("", message);
            });
    }
}

module.exports = Announce;
