const Command = require("../base/Command.js");

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
        if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
        if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);    
        const thisPlaylist = this.client.playlists.get(message.guild.id);
        if (!thisPlaylist.playing) return this.client.embed("alreadyPaused", message);   
        thisPlaylist.playing = false;
        thisPlaylist.connection.dispatcher.pause();
        return this.client.embed("paused", message);   
    }
}

module.exports = Pause;