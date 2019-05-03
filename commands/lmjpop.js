const Command = require("../base/Command.js");

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
        if (message.member.voiceChannel) {
            message.channel.send("Connecting...")
                .then(msg => {
                    message.member.voiceChannel.join()
                    .then(connection => {
                        connection.playArbitraryInput("https://listen.moe/opus");
                        msg.edit("Connected!")
                        .then(msg => { 
                            msg.edit(":musical_note: | Streaming listen.moe JPOP.");
                            this.client.user.setActivity("🎵 | listen.moe JPOP.", { type : "STREAMING" });
                        })
                    })
                })
            .catch(console.log);
        } else {
            message.reply("you are not in a voice channel!");
        }
    }
}

module.exports = LMJPop;