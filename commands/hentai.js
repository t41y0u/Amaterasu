const Command = require("../base/Command.js");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class Hentai extends Command {
    constructor (client) {
        super(client, {
            name: "hentai",
            description: "Returns hentai.",
            category: "NSFW",
            usage: "hentai",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        if (!message.channel.nsfw) {
            return message.reply("🔞|Cannot display NSFW content in a SFW channel.");
        }
        const hentai = await this.client.nekoslife.nsfw.randomHentaiGif();
        const msg = await message.channel.send({
            embed: {
                color: 0x00FFFF,
                image: {
                    url: hentai.url
                }
            }
        }).then(botmsg => ror(message, botmsg, true));
        msg.react("🗑️");
    }
}

module.exports = Hentai;
