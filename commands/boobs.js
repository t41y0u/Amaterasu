const Command = require("../base/Command.js");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class Boobs extends Command {
    constructor (client) {
        super(client, {
            name: "boobs",
            description: "Returns a boob picture.",
            category: "NSFW",
            usage: "boobs",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (!message.channel.nsfw) {
            return message.reply("🔞|Cannot display NSFW content in a SFW channel.");
        }
        let boobs = await this.client.nekoslife.nsfw.boobs();
        const msg = await message.channel.send({
            embed: {
                color: 0x00FFFF,
                image: {
                    url: boobs.url
                }
            }
        }).then(botmsg => ror(message, botmsg, true));
        msg.react("🗑️");
    }
}

module.exports = Boobs;
