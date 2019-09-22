const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Remove extends Command {
    constructor(client) {
        super(client, {
            name: "remove",
            description: "Removes a song with given index from queue.",
            category: "Music",
            usage: "remove <idx>",
            guildOnly: true
        });
    }

    async run(message, args, level) { 
        try {
            if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
            if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
            const playlist = this.client.playlists.get(message.guild.id);
            if (!args[0] || Number(args[0]) < 1 || Number(args[0]) > playlist.songs.length || isNaN(Number(args[0]))) return this.client.embed("errorQueue", message, playlist.songs.length);
            if (message.author.tag === playlist.songs[Number(args[0]) - 1].author) {
                const song = playlist.songs[Number(args[0]) - 1].title;
                playlist.songs.splice(Number(args[0]) - 1, 1);
                return this.client.embed("removed", message, [song, args[0]]);
            }
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setAuthor("⏩ Remove?")
                .setDescription("Since this song wasn't requested by you, please call upon other people to remove it by reacting to `⏩` within 60 seconds. When the number of reactions reached 3, the song will be removed.")
                .setTimestamp();
            const msg = await message.channel.send({embed});
            msg.react("⏩");
            const filter = (reaction, user) => {
                return ["⏩"].includes(reaction.emoji.name) && user !== this.client.user;
            };
            msg.awaitReactions(filter, { max: 3, time: 60000, errors: ['time'] })
                .then(collected => {
                    const song = playlist.songs[Number(args[0]) - 1].title;
                    playlist.songs.splice(Number(args[0]) - 1, 1);
                    return this.client.embed("removed", message, [song, args[0]]);
                })
                .catch(collected => {
                    const embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setAuthor("⌛ Timed out")
                        .setDescription(`Only ${collected.size} vote(s) were collected. This song will not be removed.`)
                        .setTimestamp();
                    return message.channel.send({embed});
                });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Remove;