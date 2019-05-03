const Command = require("../base/Command.js");

class Skip extends Command {
    constructor (client) {
        super(client, {
            name: "skip",
            description: "Skip a song or songs.",
            category: "Music",
            usage: "skip [number]",
            guildOnly: true,
            aliases: ["next"]
        });
    }

    async run (message, args, level) {
        if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
        if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
        const thisPlaylist = this.client.playlists.get(message.guild.id);
        thisPlaylist.loop = false;
        thisPlaylist.connection.dispatcher.end("skip");
        return this.client.embed("skipped", message);
    }
}

module.exports = Skip;