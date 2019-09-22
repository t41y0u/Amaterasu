const Command = require("../../util/Command.js");

class Test extends Command {
    constructor (client) {
        super(client, {
            name: "test",
            description: "Test.",
            category: "Music",
            usage: "test",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) return this.client.embed("noVoiceChannel", message);
            const connection = await voiceChannel.join();
            const dispatcher = connection.playFile("../../test.mp3", { seek: 69, passes: 3, volume: 100 })
            .on("end", () => {
                return message.channel.send("Finished!");
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Test;