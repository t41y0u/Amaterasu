const Command = require("../base/Command.js");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class Anal extends Command {
    constructor (client) {
        super(client, {
            name: "anal",
            description: "Returns an anal picture.",
            category: "NSFW",
            usage: "anal",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (!message.channel.nsfw) {
            return message.reply("🔞|Cannot display NSFW content in a SFW channel.");
        }
        const anal = await this.client.nekoslife.nsfw.anal();
        const msg = await message.channel.send({
            embed: {
                color: 0x00FFFF,
                image: {
                    url: anal.url
                }
            }
        }).then(botmsg => ror(message, botmsg, true));
        msg.react("🗑️");
    }
}

module.exports = Anal;
