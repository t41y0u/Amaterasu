const Command = require("../base/Command.js");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class Blowjob extends Command {
    constructor (client) {
        super(client, {
            name: "blowjob",
            description: "Returns a blowjob picture.",
            category: "NSFW",
            usage: "blowjob",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (!message.channel.nsfw) {
            return message.reply("🔞|Cannot display NSFW content in a SFW channel.");
        }
        const blowjob = await this.client.nekoslife.nsfw.bJ();
        const msg = await message.channel.send({
            embed: {
                color: 0x00FFFF,
                image: {
                    url: blowjob.url
                }
            }
        }).then(botmsg => ror(message, botmsg, true));
        msg.react("🗑️");
    }
}

module.exports = Blowjob;
