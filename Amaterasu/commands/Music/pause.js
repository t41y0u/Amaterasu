const Command = require("../../util/Command.js");

class Pause extends Command {
    constructor (client) {
        super(client, {
            name: "pause",
            description: "Pauses playing music.",
            category: "Music",
            usage: "pause",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
            if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);    
            const playlist = this.client.playlists.get(message.guild.id);
            if (!playlist.playing) return this.client.embed("alreadyPaused", message);   
            playlist.playing = false;
            playlist.connection.dispatcher.pause();
            return this.client.embed("paused", message);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Pause;