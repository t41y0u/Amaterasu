const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class LMJPop extends Command {
    constructor (client) {
        super(client, {
            name: "lmjpop",
            description: "Streams some listen.moe j-pop music.",
            category: "Music",
            usage: "lmjpop",
            guildOnly: true,
            aliases: ["lmj", "jpop"]
        });
    }

    async run (message, args, level) {
        try {
            if (message.member.voiceChannel) {
                message.channel.send("Connecting...")
                    .then(msg => {
                        message.member.voiceChannel.join()
                        .then(connection => {
                            connection.playArbitraryInput("https://listen.moe/opus");
                            msg.edit("Connected!")
                            .then(msg => { 
                                const embed = new RichEmbed().setColor(0x00FFFF).setTitle("🎶 Streaming radio").setDescription("Streaming from listen.moe JPOP.")
                                msg.edit(embed);
                                this.client.user.setPresence({ game: { name: "🎶 | listen.moe JPOP.", type : "STREAMING" } });
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

module.exports = LMJPop;