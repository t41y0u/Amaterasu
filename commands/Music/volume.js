const Command = require("../../util/Command.js");

class Volume extends Command {
    constructor (client) {
        super(client, {
            name: "volume",
            description: "Changes the volume output of the bot or displays current volume (DO NOT use this command when the bot's streaming radio music).",
            category: "Music",
            usage: "volume [number]",
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
            if (!args[0]) return this.client.embed("currentVolume", message);
            if (Number(args[0]) < 0 || Number(args[0]) > 100 || isNaN(Number(args[0]))) return this.client.embed("errorVolume", message);
            message.guild.voiceConnection.volume = Number(args[0]) / 100;
            this.client.playlists.get(message.guild.id).volume = Number(args[0]);
            this.client.playlists.get(message.guild.id).connection.dispatcher.setVolumeLogarithmic(Number(args[0]) / 100);
            return this.client.embed("volumeSet", message, args);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Volume;