const Command = require("../../util/Command.js");

class Loop extends Command {
    constructor(client) {
        super(client, {
            name: "loop",
            description: "Loops or unloops the current playing song.",
            category: "Music",
            usage: "loop",
            guildOnly: true,
            aliases: ["unloop"]
        });
    }

    async run(message) {
        try {
            if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
            const voiceChannel = message.member.voiceChannel;
            const playlist = this.client.playlists.get(message.guild.id);
            if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
            if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
            if (playlist.loop) {
                playlist.loop = false;
                return this.client.embed("unloopedEmbed", message);
            } else {
                playlist.loop = true;
                return this.client.embed("loopedEmbed", message);
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Loop;