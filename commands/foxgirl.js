const Command = require("../base/Command.js");

class FoxGirl extends Command {
    constructor (client) {
        super(client, {
            name: "foxgirl",
            description: "Returns a foxgirl.",
            category: "Weeb",
            usage: "foxgirl",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        let foxgirl = await this.client.nekoslife.sfw.foxGirl();
        message.channel.send({
            embed: {
                color: 0x00FFFF,
                image: {
                    url: foxgirl.url
                }
            }
        });
    }
}

module.exports = FoxGirl;
