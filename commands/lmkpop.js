const Command = require("../base/Command.js");

class LMKPop extends Command {
    constructor (client) {
        super(client, {
            name: "lmkpop",
            description: "Streams some listen.moe k-pop music.",
            category: "Music",
            usage: "lmkpop",
            guildOnly: true,
            aliases: ["lmk", "kpop"]
        });
    }

    async run (message, args, level) {
        if (message.member.voiceChannel) {
            message.channel.send("Connecting...")
                .then(msg => {
                    message.member.voiceChannel.join()
                    .then(connection => {
                        connection.playArbitraryInput("https://listen.moe/kpop/opus");
                        msg.edit("Connected!")
                        .then(msg => { 
                            msg.edit(":musical_note: | Streaming listen.moe KPOP.");
                            this.client.user.setActivity("🎵 | listen.moe KPOP.", { type : "STREAMING" });
                        })
                    })
                })
            .catch(console.log);
        } else {
            message.reply("you are not in a voice channel!");
        }
    }
}

module.exports = LMKPop;