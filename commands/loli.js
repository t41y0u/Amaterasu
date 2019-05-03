const Command = require("../base/Command.js");

class Loli extends Command {
    constructor (client) {
        super(client, {
            name: "loli",
            description: "Returns a cute loli.",
            category: "Weeb",
            usage: "loli",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        let loli = await this.client.lolislife.getSFWLoli();
        message.channel.send({
            embed: {
                color: 0x00FFFF,
                image: {
                    url: loli.url
                }
            }
        });
    }
}

module.exports = Loli;
