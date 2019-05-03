const Command = require("../base/Command.js");

class AnimeNexus extends Command {
    constructor (client) {
        super(client, {
            name: "animenexus",
            description: "Streams Anime Nexus radio.",
            category: "Music",
            usage: "animenexus",
            guildOnly: true,
            aliases: ["an"]
        });
    }

    async run (message, args, level) {
        if (message.member.voiceChannel) {
            message.channel.send("Connecting...")
                .then(msg => {
                    message.member.voiceChannel.join()
                    .then(connection => {
                        connection.playArbitraryInput("http://radio.animenexus.mx:8000/animenexus");
                        msg.edit("Connected!")
                        .then(msg => { 
                            msg.edit(":musical_note: | Streaming AnimeNexus.");
                            this.client.user.setActivity("🎵 | AnimeNexus.", { type : "STREAMING" });
                        })
                    })
                })
            .catch(console.log);
        } else {
            message.reply("you are not in a voice channel!");
        }
    }
}

module.exports = AnimeNexus;