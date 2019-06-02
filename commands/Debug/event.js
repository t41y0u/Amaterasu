const Command = require("../../util/Command.js");

class Event extends Command {
    constructor(client) {
        super(client, {
            name: "event",
            description: "Emits an event.",
            category: "Debug",
            usage: "event",
            aliases: ["emit"],
            permLevel: "Bot Owner",
            guildOnly: true
        });
    }

    async run(message, args, level) {
        const member = message.mentions.members.first() || message.member;
        await this.client.emit("guildMemberAdd", member);
    }
}

module.exports = Event;