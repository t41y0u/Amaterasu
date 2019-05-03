const Command = require("../base/Command.js");

class Stop extends Command {
    constructor(client) {
        super(client, {
            name: "stop",
            description: "Stops the current playing songs and clears the queue.",
            category: "Music",
            usage: "stop",
            guildOnly: true,
            aliases: ["clear"]
        });
    }

    async run(message) { 
        if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
        if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
        const thisPlaylist = this.client.playlists.get(message.guild.id);
        thisPlaylist.songs = [];
        thisPlaylist.connection.dispatcher.end();
        return this.client.embed("stopped", message);
    }
}

module.exports = Stop;