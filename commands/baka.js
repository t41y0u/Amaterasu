const Command = require("../base/Command.js");

class Baka extends Command {
    constructor (client) {
        super(client, {
            name: "baka",
            description: "Returns a baka.",
            category: "Weeb",
            usage: "baka",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            let baka = await this.client.nekoslife.sfw.baka();
            message.channel.send({
                embed: {
                    color: 0x00FFFF,
                    image: {
                        url: baka.url
                    }
                }
            });
        } catch (err) {
            message.reply("an error occured while processing the request!")
            console.log(err).catch();
        }
    }
}

module.exports = Baka;
