const Command = require("../../util/Command.js");
const Discord = require("discord.js");

class Poll extends Command {
    constructor (client) {
        super(client, {
            name: "poll",
            description: "Starts a poll on something.",
            category: "Misc",
            usage: "poll <question>",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            if (!args.join(" ")) {
                return this.client.embed("commonError", message, "Please provide a question to start the poll.");
            }
            const embed = new Discord.RichEmbed()
                .setColor(0x00FFFF)
                .setTitle(args.join(" "))
                .setDescription(`Poll created by ${message.author.tag}`)
            const msg = await message.channel.send({embed});
            await msg.react("👍");
            await msg.react("👎");
            await msg.react("🤷");
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Poll;