const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

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
        try {
            if (message.settings.djonly && !message.member.roles.some(c => c.name.toLowerCase() === message.settings.djrole.toLowerCase())) return message.client.embed("notDJ", message);
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
            if (!this.client.playlists.has(message.guild.id)) return this.client.embed("emptyQueue", message);
            const playlist = this.client.playlists.get(message.guild.id);
            if (message.author.tag === playlist.songs[0].author) {
                playlist.loop = false;
                playlist.connection.dispatcher.end("skip");
                return this.client.embed("skipped", message);
            }
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setAuthor("⏩ Skip?")
                .setDescription("Since this song wasn't requested by you, please call upon other people to skip it by reacting to `⏩` within 60 seconds. When the number of reactions reached 3, the song will be skipped.")
                .setTimestamp();
            const msg = await message.channel.send({embed});
            msg.react("⏩");
            const filter = (reaction, user) => {
                return ["⏩"].includes(reaction.emoji.name) && user !== this.client.user;
            };
            msg.awaitReactions(filter, { max: 3, time: 60000, errors: ['time'] })
                .then(collected => {
                    playlist.loop = false;
                    playlist.connection.dispatcher.end("skip");
                    return this.client.embed("skipped", message);
                })
                .catch(collected => {
                    const embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setAuthor("⌛ Timed out")
                        .setDescription(`Only ${collected.size} vote(s) were collected. This song will not be skipped.`)
                        .setTimestamp();
                    return message.channel.send({embed});
                });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Skip;