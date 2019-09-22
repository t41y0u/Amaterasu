const Command = require("../../util/Command.js");

class NowPlaying extends Command {
    constructor (client) {
        super(client, {
            name: "np",
            description: "Returns the current playing song.",
            category: "Music",
            usage: "np",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
            if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
            return this.client.embed("nowPlaying", message);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = NowPlaying;