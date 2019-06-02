const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class AnimeNexus extends Command {
    constructor (client) {
        super(client, {
            name: "animenexus",
            description: "Streams Anime Nexus radio.",
            category: "Weeb",
            usage: "animenexus",
            guildOnly: true,
            aliases: ["an"]
        });
    }

    async run (message, args, level) {
        try {
            if (message.member.voiceChannel) {
                message.channel.send("Connecting...")
                    .then(msg => {
                        message.member.voiceChannel.join()
                        .then(connection => {
                            connection.playArbitraryInput("http://radio.animenexus.mx:8000/animenexus");
                            msg.edit("Connected!")
                            .then(msg => { 
                                const embed = new RichEmbed().setColor(0x00FFFF).setTitle("🎶 Streaming radio").setDescription("Streaming from AnimeNexus.")
                                msg.edit(embed);
                                this.client.user.setPresence({ game: { name: "🎶 | AnimeNexus.", type : "STREAMING" } });
                            })
                        })
                    })
                .catch(console.log);
            } else {
                return this.client.embed("noVoiceChannel", message);
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = AnimeNexus;