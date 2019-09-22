const Command = require("../../util/Command.js");

class Shuffle extends Command {
    constructor (client) {
        super(client, {
            name: "shuffle",
            description: "Shuffles the queue.",
            category: "Music",
            usage: "shuffle",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                if (randomIndex === 0) continue;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }
        try {
            if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
            if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
            if (this.client.playlists.get(message.guild.id).songs.length === 1) return this.client.embed("noSongsShuffle", message);
            shuffle(this.client.playlists.get(message.guild.id).songs);
            return this.client.embed("shuffled", message);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Shuffle;