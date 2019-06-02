const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class QT extends Command {
    constructor (client) {
        super(client, {
            name: "qt",
            description: "Streams some qtradio anime music.",
            category: "Weeb",
            usage: "qt",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            if (message.member.voiceChannel) {
                message.channel.send("Connecting...")
                    .then(msg => {
                        message.member.voiceChannel.join()
                        .then(connection => {
                            connection.playArbitraryInput("https://qtradio.moe/stream");
                            msg.edit("Connected!")
                            .then(msg => { 
                                const embed = new RichEmbed().setColor(0x00FFFF).setTitle("🎶 Streaming radio").setDescription("Streaming from qtradio.moe.")
                                msg.edit(embed);
                                this.client.user.setPresence({ game: { name: "🎶 | qtradio.moe.", type : "STREAMING" } });
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

module.exports = QT;