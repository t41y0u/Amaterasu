const Command = require("../base/Command.js");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class Yuri extends Command {
    constructor (client) {
        super(client, {
            name: "yuri",
            description: "Returns a yuri picture.",
            category: "NSFW",
            usage: "yuri",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (!message.channel.nsfw) {
            return message.reply("🔞|Cannot display NSFW content in a SFW channel.");
        }
        const yuri = await this.client.nekoslife.nsfw.yuri();
        const msg = await message.channel.send({
            embed: {
                color: 0x00FFFF,
                image: {
                    url: yuri.url
                }
            }
        }).then(botmsg => ror(message, botmsg, true));
        msg.react("🗑️");
    }
}

module.exports = Yuri;
