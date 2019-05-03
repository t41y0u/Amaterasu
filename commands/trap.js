const Command = require("../base/Command.js");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class Trap extends Command {
    constructor (client) {
        super(client, {
            name: "trap",
            description: "Returns a trap picture.",
            category: "NSFW",
            usage: "trap",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (!message.channel.nsfw) {
            return message.reply("🔞|Cannot display NSFW content in a SFW channel.");
        }
        const trap = await this.client.nekoslife.nsfw.trap();
        const msg = await message.channel.send({
            embed: {
                color: 0x00FFFF,
                image: {
                    url: trap.url
                }
            }
        }).then(botmsg => ror(message, botmsg, true));
        msg.react("🗑️");
    }
}

module.exports = Trap;
