const Command = require("../base/Command.js");

class Queue extends Command {
    constructor (client) {
        super(client, {
            name: "queue",
            description: "View the current queue.",
            category: "Music",
            usage: "queue [position]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
        if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
        return this.client.embed("queueEmbed", message);
    }
}

module.exports = Queue;