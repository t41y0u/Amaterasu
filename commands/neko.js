const Command = require("../base/Command.js");

class Neko extends Command {
    constructor (client) {
        super(client, {
            name: "neko",
            description: "Returns a neko.",
            category: "Weeb",
            usage: "neko",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        let neko = await this.client.nekoslife.sfw.neko();
        message.channel.send({
            embed: {
                color: 0x00FFFF,
                image: {
                    url: neko.url
                }
            }
        });
    }
}

module.exports = Neko;
