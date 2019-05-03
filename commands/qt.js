const Command = require("../base/Command.js");

class QT extends Command {
    constructor (client) {
        super(client, {
            name: "qt",
            description: "Streams some qtradio anime music.",
            category: "Music",
            usage: "qt",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (message.member.voiceChannel) {
            message.channel.send("Connecting...")
                .then(msg => {
                    message.member.voiceChannel.join()
                    .then(connection => {
                        connection.playArbitraryInput("https://qtradio.moe/stream");
                        msg.edit("Connected!")
                        .then(msg => { 
                            msg.edit(":musical_note: | Streaming qtradio.moe");
                            this.client.user.setActivity("🎵 | qtradio.moe.", { type : "STREAMING" });
                        })
                    })
                })
            .catch(console.log);
        } else {
            message.reply("you are not in a voice channel!");
        }
    }
}

module.exports = QT;