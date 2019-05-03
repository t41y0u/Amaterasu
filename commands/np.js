const Command = require("../base/Command.js");

class NowPlaying extends Command {
    constructor (client) {
        super(client, {
            name: "np",
            description: "Displays the current playing song.",
            category: "Music",
            usage: "np",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
        if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
        return this.client.embed("nowPlaying", message);
    }
}

module.exports = NowPlaying;