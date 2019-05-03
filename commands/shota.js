const Command = require("../base/Command.js");

class Shota extends Command {
    constructor (client) {
        super(client, {
            name: "shota",
            description: "Returns a shota.",
            category: "Weeb",
            usage: "shota",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        let shota = await this.client.lolislife.getSFWShota();
        message.channel.send({
            embed: {
                color: 0x00FFFF,
                image: {
                    url: shota.url
                }
            }
        });
    }
}

module.exports = Shota;
